import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from 'db';
import { AuthedUser, AuthenticatedUser } from '../auth/auth.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

class CreateTransferDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  accountSenderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  accountReceiverId: string;

  @ApiProperty({ type: Number })
  @Type(() => Prisma.Decimal)
  @IsPositive()
  amount: Prisma.Decimal;
}

@ApiTags('transfers')
@Controller('transfers')
@UsePipes(new ValidationPipe({ transform: true }))
export class TransfersController {
  @Inject(TransfersService)
  private readonly transfersService: TransfersService;

  @ApiOperation({ summary: 'Create transfer' })
  @Post()
  @ApiOkResponse()
  @UseGuards(AuthGuard)
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
