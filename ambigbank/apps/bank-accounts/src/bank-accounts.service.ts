import { Inject, Injectable } from '@nestjs/common';

import { BankAccount, Prisma } from 'db';
import { PrismaService } from './services/prisma.service';

@Injectable()
export class BankAccountService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async getBankAccount(params: {
    where: Prisma.BankAccountWhereUniqueInput;
  }): Promise<BankAccount | null> {
    const result = await this.prisma.bankAccount.findUnique({
      where: params.where,
    });
    return result;
  }

  async createBankAccount(
    data: Prisma.BankAccountCreateInput,
  ): Promise<BankAccount> {
    const result = await this.prisma.bankAccount.create({
      data: {
        ...data,
        balance: 0,
      },
    });
    return result;
  }

  async listBankAccounts(params: {
    where: Prisma.BankAccountWhereInput;
  }): Promise<BankAccount[]> {
    const result = await this.prisma.bankAccount.findMany({
      where: params.where,
    });
    return result;
  }

  async deposit(data: {
    accountId: string;
    amount: Prisma.Decimal;
  }): Promise<BankAccount> {
    const account = await this.getBankAccount({
      where: { id: data.accountId },
    });
    if (!account) {
      throw new Error('Account not found');
    }

    const result = await this.prisma.bankAccount.update({
      where: { id: data.accountId },
      data: { balance: account.balance.plus(data.amount) },
    });
    return result;
  }
}
