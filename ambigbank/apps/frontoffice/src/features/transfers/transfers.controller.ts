import { Body, Controller, Inject, Post } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { IsDecimal, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from 'db';
import { AuthedUser, AuthenticatedUser } from '../auth/auth.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

class CreateTransferDto {
  @ApiProperty()
  @IsNotEmpty()
  accountSenderId: string;

  @ApiProperty()
  @IsNotEmpty()
  accountReceiverId: string;

  @ApiProperty({ type: Number })
  @IsDecimal()
  @Type(() => Prisma.Decimal)
  @IsPositive()
  amount: Prisma.Decimal;
}

@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
  @Inject(TransfersService)
  private readonly transfersService: TransfersService;

  @ApiOperation({ summary: 'Create transfer' })
  @Post()
  @ApiOkResponse()
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
