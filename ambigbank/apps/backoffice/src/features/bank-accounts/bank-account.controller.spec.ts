import { describe, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountService } from './bank-accounts.service';
import { CommonModule } from 'src/services/common.module';
import { AuthModule } from '../auth/auth.module';
import { Prisma, User, prisma } from 'db';

describe('BankAccountController', () => {
  let bankAccountController: BankAccountsController;
  let user: User;

  beforeEach(async () => {
    await prisma.bankAccount.deleteMany();
    await prisma.user.deleteMany();
    user = await prisma.user.create({
      data: {
        email: 'john@example.com',
        password: 'password',
      },
    });
    const app: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, AuthModule],
      controllers: [BankAccountsController],
      providers: [BankAccountService],
    }).compile();

    bankAccountController = app.get<BankAccountsController>(
      BankAccountsController,
    );
  });

  it('can create an account and list it', async () => {
    const bankAccount = await bankAccountController.createBankAccount(user, {
      title: 'My Bank Account',
    });

    expect(bankAccount).toMatchObject({
      balance: expect.toBeDecimal(0),
      createdAt: expect.any(Date),
      id: expect.any(String),
      title: 'My Bank Account',
      userId: user.id,
    });

    const userAccounts = await bankAccountController.listBankAccounts(user);
    expect(userAccounts).toHaveLength(1);

    expect(userAccounts[0].id).toBe(bankAccount.id);
  });

  it('can deposit money', async () => {
    const bankAccount = await bankAccountController.createBankAccount(user, {
      title: 'My Bank Account',
    });
    const updatedAccount = await bankAccountController.deposit(user, {
      accountId: bankAccount.id,
      amount: new Prisma.Decimal(100),
    });
    expect(updatedAccount.balance).toBeDecimal(100);
  });
});
