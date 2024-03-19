import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma, MoneyTransfer, TransferStatus } from 'PrismaClient';
import { PrismaService } from './services/prisma.service';
import {
  BankAccountService,
  UserService,
  QueueService,
  TransferAcknowledgedEvent,
  TransferInitiatedEvent,
} from '@ambigbank/services';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransfersService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(QueueService)
  private readonly queueService: QueueService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(BankAccountService)
  private readonly bankAccountService: BankAccountService;

  async createTransfer(data: {
    userId: string;
    senderId: string;
    receiverId: string;
    amount: string;
  }): Promise<Omit<MoneyTransfer, 'amount'> & { amount: string }> {
    const amount = new Prisma.Decimal(data.amount);
    const { senderId, userId, receiverId } = data;

    // Check user is not sending to themselves
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send to yourself');
    }

    const transfer = await this.prisma.moneyTransfer.create({
      data: {
        fromAccountId: senderId,
        toAccountId: receiverId,
        amount,
        status: TransferStatus.PENDING,
      },
    });

    const transferInitiatedQueue = this.configService.get(
      'services.transfers.events.initiatedQueue',
    );
    const payload: TransferInitiatedEvent = {
      type: 'transfer:initiated',
      transferId: transfer.id,
      userId,
      fromAccountId: senderId,
      toAccountId: receiverId,
      amount: amount.toString(),
    };

    console.log(
      'Sending transfer initiated event',
      payload,
      transferInitiatedQueue,
    );
    this.queueService.send(transferInitiatedQueue, payload);

    return {
      ...transfer,
      amount: transfer.amount.toString(),
    };
  }

  async completeTransfer(
    event: TransferAcknowledgedEvent,
  ): Promise<Omit<MoneyTransfer, 'amount'> & { amount: string }> {
    if (!event.ok) {
      const transfer = await this.prisma.moneyTransfer.update({
        where: { id: event.transferId },

        data: { status: TransferStatus.FAILED, errorReason: event.reason },
      });

      return { ...transfer, amount: transfer.amount.toString() };
    }

    const transfer = await this.prisma.moneyTransfer.findUnique({
      where: { id: event.transferId },
    });

    await this.prisma.moneyTransfer.update({
      where: { id: event.transferId },
      data: { status: TransferStatus.COMPLETED },
    });
    const receiverAccount = await this.bankAccountService.getBankAccount(
      transfer.toAccountId,
    );
    const senderAccount = await this.bankAccountService.getBankAccount(
      transfer.fromAccountId,
    );

    const sender = await this.userService.getUser(senderAccount.userId);
    const receiver = await this.userService.getUser(receiverAccount.userId);
    const amount = transfer.amount.toString();

    const notificationsQueue = this.configService.get(
      'services.notifications.queue',
    );
    this.queueService.send(notificationsQueue, {
      type: 'notify:all',
      to: sender,
      title: `${amount}€ sent 💸`,
      message: `You have sent ${amount} to ${receiver.firstName}`,
    });

    this.queueService.send(notificationsQueue, {
      type: 'notify:all',
      to: receiver,
      title: `${amount}€ received 🤑`,
      message: `You have received ${amount} from ${sender.firstName}`,
    });

    return {
      ...transfer,
      amount,
    };
  }

  async listTransfers(
    params: {
      where?: Prisma.MoneyTransferWhereInput;
    } = {},
  ): Promise<MoneyTransfer[]> {
    const result = await this.prisma.moneyTransfer.findMany({
      where: params.where,
      orderBy: { createdAt: 'desc' },
    });
    return result;
  }
}
