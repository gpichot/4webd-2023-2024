import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { BankAccount, Prisma } from 'PrismaClient';
import { QueueService, TransferInitiatedEvent } from '@ambigbank/services';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BankAccountService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(QueueService)
  private readonly queueService: QueueService;

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
      orderBy: { createdAt: 'asc' },
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

  async transfer(data: TransferInitiatedEvent) {
    const queue = this.configService.get(
      'services.transfers.events.acknowledgedQueue',
    );
    try {
      await this.prisma.$transaction(async (prisma) => {
        const fromAccount = await prisma.bankAccount.findUnique({
          where: { id: data.fromAccountId },
        });
        const toAccount = await prisma.bankAccount.findUnique({
          where: { id: data.toAccountId },
        });
        if (!fromAccount || !toAccount) {
          throw new Error('Account not found');
        }

        if (fromAccount.userId !== data.userId) {
          throw new Error('User not authorized');
        }

        if (fromAccount.balance.lt(data.amount)) {
          throw new Error('Insufficient funds');
        }
        const minus = await prisma.bankAccount.update({
          where: { id: data.fromAccountId },
          data: { balance: fromAccount.balance.minus(data.amount) },
        });
        const plus = await prisma.bankAccount.update({
          where: { id: data.toAccountId },
          data: { balance: toAccount.balance.plus(data.amount) },
        });
        return { minus, plus };
      });

      return this.queueService.send(queue, {
        transferId: data.transferId,
        ok: true,
        reason: null,
      });
    } catch (error) {
      this.queueService.send(queue, {
        transferId: data.transferId,
        ok: false,
        reason: error.message,
      });
    }
  }
}
