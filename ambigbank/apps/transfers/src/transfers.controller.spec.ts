import { describe, afterEach, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { CommonModule } from 'src/services/common.module';
import { BankAccount, Prisma, User, prisma } from 'db';
import { BankAccountService, NotificationsService } from '@ambigbank/services';
import { ConfigModule } from '@nestjs/config';

describe('TransferController', () => {
  let transferController: TransfersController;
  let sender: User;
  let senderAccount: BankAccount;
  let receiver: User;
  let receiverAccount: BankAccount;

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
      imports: [CommonModule, ConfigModule],
      controllers: [TransfersController],
      providers: [TransfersService, BankAccountService, NotificationsService],
    }).compile();

    transferController = app.get<TransfersController>(TransfersController);
  });

  afterEach(async () => {
    await prisma.moneyTransfer.deleteMany();
    await prisma.bankAccount.deleteMany();
    await prisma.user.deleteMany();
  });

  it.skip('can transfer money', async () => {
    const transfer = await transferController.createTransfer({
      userId: sender.id,
      senderId: senderAccount.id,
      receiverId: receiverAccount.id,
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
