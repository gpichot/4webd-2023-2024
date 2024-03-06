import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';

import { BankAccount, Prisma } from '@prisma/client';

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
    userId: string;
    accountId: string;
    amount: Prisma.Decimal;
  }): Promise<BankAccount> {
    const account = await this.getBankAccount({
      where: { id: data.accountId },
    });
    if (!account) {
      throw new Error('Account not found');
    }
    if (account.userId !== data.userId) {
      throw new Error('Account does not belong to user');
    }
    const result = await this.prisma.bankAccount.update({
      where: { id: data.accountId },
      data: { balance: account.balance.plus(data.amount) },
    });
    return result;
  }
}
