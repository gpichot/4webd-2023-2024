import { describe, afterEach, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { CommonModule } from 'src/services/common.module';
import { AuthModule } from '../auth/auth.module';
import { BankAccount, Prisma, User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { BankAccountModule } from '../bank-accounts/bank-account.module';
import { NotificationsModule } from '../notifications/notifications.module';

describe('TransferController', () => {
  let transferController: TransfersController;
  let sender: User;
  let senderAccount: BankAccount;
  let receiver: User;
  let receiverAccount: BankAccount;
  const prisma = new PrismaClient();

  beforeEach(async () => {
    await prisma.moneyTransfer.deleteMany();
    await prisma.bankAccount.deleteMany();
    await prisma.user.deleteMany();
    sender = await prisma.user.create({
      data: {
        email: 'john@example.com',
        password: 'password',
      },
    });
    receiver = await prisma.user.create({
      data: {
        email: 'jane@example.com',
        password: 'password',
      },
    });
    receiverAccount = await prisma.bankAccount.create({
      data: {
        balance: 100,
        title: 'My Bank Account',
        userId: receiver.id,
      },
    });
    senderAccount = await prisma.bankAccount.create({
      data: {
        balance: 100,
        title: 'My Bank Account',
        userId: sender.id,
      },
    });

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        AuthModule,
        BankAccountModule,
        NotificationsModule,
      ],
      controllers: [TransfersController],
      providers: [TransfersService],
    }).compile();

    transferController = app.get<TransfersController>(TransfersController);
  });

  afterEach(async () => {
    await prisma.moneyTransfer.deleteMany();
    await prisma.bankAccount.deleteMany();
    await prisma.user.deleteMany();
  });

  it('can transfer money', async () => {
    const transfer = await transferController.createTransfer(sender, {
      accountSenderId: senderAccount.id,
      accountReceiverId: receiverAccount.id,
      amount: new Prisma.Decimal(10),
    });

    expect(transfer).toMatchObject({
      amount: expect.toBeDecimal(10),
      fromAccountId: senderAccount.id,
      toAccountId: receiverAccount.id,
      createdAt: expect.any(Date),
    });

    const senderAccountAfter = await prisma.bankAccount.findUnique({
      where: { id: senderAccount.id },
    });
    expect(senderAccountAfter.balance).toBeDecimal(90);
    const receiverAccountAfter = await prisma.bankAccount.findUnique({
      where: { id: receiverAccount.id },
    });

    expect(receiverAccountAfter.balance).toBeDecimal(110);
  });
});
