import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';
import { Type, plainToClass } from 'class-transformer';
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
  @IsPositive()
  amount: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

class TransferDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty()
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
  @ApiOkResponse({ type: TransferDto })
  async createTransfer(@Body() body: CreateTransferDto) {
    return plainToClass(
      TransferDto,
      this.transfersService.createTransfer(body),
      { excludeExtraneousValues: true },
    );
  }
}
