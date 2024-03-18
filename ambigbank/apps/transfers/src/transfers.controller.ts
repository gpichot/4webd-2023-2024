import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';
import { Expose, Type, plainToClass } from 'class-transformer';
import { Prisma } from 'PrismaClient';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

class CreateTransferDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  senderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  receiverId: string;

  @ApiProperty({ type: String })
  amount: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

class TransferDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  senderId: string;

  @ApiProperty()
  @Expose()
  receiverId: string;

  @ApiProperty()
  @Type(() => Prisma.Decimal)
  @IsPositive()
  @Expose()
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
  @ApiOkResponse({ type: TransferDto })
  async createTransfer(@Body() body: CreateTransferDto) {
    return plainToClass(
      TransferDto,
      this.transfersService.createTransfer(body),
      { excludeExtraneousValues: true },
    );
  }

  @ApiOperation({ summary: 'List transfers' })
  @Get()
  @ApiOkResponse({ type: [TransferDto] })
  async listTransfers() {
    const transfers = await this.transfersService.listTransfers({});

    const items = transfers.map((transfer) => {
      return plainToClass(
        TransferDto,
        {
          id: transfer.id,
          amount: transfer.amount.toString(),
          senderId: transfer.fromAccountId,
          receiverId: transfer.toAccountId,
        },
        {
          excludeExtraneousValues: true,
        },
      );
    });

    return items;
  }
}
