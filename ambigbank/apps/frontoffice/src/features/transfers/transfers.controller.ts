import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';
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
  @IsPositive()
  amount: number;
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
      amount: body.amount.toFixed(2),
    });
  }

  @ApiOperation({ summary: 'List transfers' })
  @Get()
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  async listTransfers() {
    return this.transfersService.listTransfers();
  }
}
