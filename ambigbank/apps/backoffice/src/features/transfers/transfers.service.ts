import { Inject, Injectable } from '@nestjs/common';
import { Prisma, MoneyTransfer } from 'db';
import { PrismaService } from '../../services/prisma.service';
import { BankAccountService } from '../bank-accounts/bank-accounts.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TransfersService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(BankAccountService)
  private readonly bankAccountService: BankAccountService;

  @Inject(NotificationsService)
  private readonly notificationsService: NotificationsService;

  async createTransfer(data: {
    userId: string;
    senderId: string;
    receiverId: string;
    amount: Prisma.Decimal;
  }): Promise<MoneyTransfer> {
    const { senderId, userId, receiverId, amount } = data;
    const account = await this.bankAccountService.getBankAccount({
      where: { id: senderId },
    });

    if (!account) {
      throw new Error('Sender account not found');
    }

    if (account.userId !== userId) {
      throw new Error('Sender account does not belong to user');
    }

    // Check user is not sending to themselves
    if (senderId === receiverId) {
      throw new Error('Cannot send to yourself');
    }

    const moneyTransfer = await this.prisma.$transaction(async (tx) => {
      const sender = await tx.bankAccount.findUnique({
        where: { id: data.senderId },
      });

      if (sender.balance < amount) {
        throw new Error('Insufficient funds');
      }

      await tx.bankAccount.update({
        where: { id: senderId },
        data: { balance: sender.balance.minus(amount) },
      });

      await tx.bankAccount.update({
        where: { id: receiverId },
        data: { balance: { increment: amount } },
      });

      return await tx.moneyTransfer.create({
        data: {
          fromAccountId: senderId,
          toAccountId: receiverId,
          amount,
        },
      });
    });

    // FIXME: use a bus for this
    const sender = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const receiver = await this.prisma.user.findFirst({
      where: { accounts: { some: { id: receiverId } } },
    });

    this.notificationsService.sendNotification({
      type: 'all',
      to: sender,
      title: `${amount}€ sent 💸`,
      message: `You have sent ${amount} to ${receiver.firstName}`,
    });

    this.notificationsService.sendNotification({
      type: 'all',
      to: receiver,
      title: `${amount}€ received 🤑`,
      message: `You have received ${amount} from ${sender.firstName}`,
    });

    return moneyTransfer;
  }
  async listTransfers(params: {
    where: Prisma.MoneyTransferWhereInput;
  }): Promise<MoneyTransfer[]> {
    const result = await this.prisma.moneyTransfer.findMany({
      where: params.where,
    });
    return result;
  }
}
