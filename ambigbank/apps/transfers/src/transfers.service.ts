import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma, MoneyTransfer } from 'PrismaClient';
import { PrismaService } from './services/prisma.service';
import {
  NotificationsService,
  BankAccountService,
  UserService,
} from '@ambigbank/services';

@Injectable()
export class TransfersService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(BankAccountService)
  private readonly bankAccountService: BankAccountService;

  @Inject(NotificationsService)
  private readonly notificationsService: NotificationsService;

  async createTransfer(data: {
    userId: string;
    senderId: string;
    receiverId: string;
    amount: string;
  }): Promise<Omit<MoneyTransfer, 'amount'> & { amount: string }> {
    const amount = new Prisma.Decimal(data.amount);
    const { senderId, userId, receiverId } = data;
    const accountSender =
      await this.bankAccountService.getBankAccount(senderId);

    if (!accountSender) {
      throw new BadRequestException('Sender account not found');
    }

    if (accountSender.userId !== userId) {
      throw new BadRequestException('Sender account does not belong to user');
    }

    // Check user is not sending to themselves
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send to yourself');
    }

    if (accountSender.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    const responseReceiver = await this.bankAccountService.deposit({
      accountId: receiverId,
      amount: amount.toString(),
    });

    const responseSender = await this.bankAccountService.deposit({
      accountId: senderId,
      amount: amount.mul(-1).toString(),
    });

    if (!responseReceiver || !responseSender) {
      throw new BadRequestException('Transaction failed');
    }

    // FIXME: How to handle the transaction failure here?
    const transfer = await this.prisma.moneyTransfer.create({
      data: {
        fromAccountId: senderId,
        toAccountId: receiverId,
        amount,
      },
    });

    const sender = await this.userService.getUser(userId);
    const receiver = await this.userService.getUser(userId);

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

    return {
      ...transfer,
      amount: transfer.amount.toString(),
    };
  }

  async listTransfers(
    params: {
      where?: Prisma.MoneyTransferWhereInput;
    } = {},
  ): Promise<MoneyTransfer[]> {
    const result = await this.prisma.moneyTransfer.findMany({
      where: params.where,
    });
    return result;
  }
}
