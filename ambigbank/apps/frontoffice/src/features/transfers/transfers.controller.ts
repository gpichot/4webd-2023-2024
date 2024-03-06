import { Body, Controller, Inject, Post } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { IsDecimal, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { AuthedUser, AuthenticatedUser } from '../auth/auth.decorator';

class CreateTransferDto {
  @IsNotEmpty()
  accountSenderId: string;

  @IsNotEmpty()
  accountReceiverId: string;

  @IsDecimal()
  @Type(() => Prisma.Decimal)
  @IsPositive()
  amount: Prisma.Decimal;
}

@Controller('transfers')
export class TransfersController {
  @Inject(TransfersService)
  private readonly transfersService: TransfersService;

  @Post()
  async createTransfer(
    @AuthedUser() user: AuthenticatedUser,
    @Body() body: CreateTransferDto,
  ) {
    return this.transfersService.createTransfer({
      userId: user.id,
      senderId: body.accountSenderId,
      receiverId: body.accountReceiverId,
      amount: body.amount,
    });
  }
}
