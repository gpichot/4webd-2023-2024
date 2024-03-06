import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Prisma } from 'db';

export class TransferDto {
  @ApiProperty()
  @IsNotEmpty()
  fromAccountId: string;

  @ApiProperty()
  @IsNotEmpty()
  toAccountId: string;

  @ApiProperty()
  @Type(() => Prisma.Decimal)
  @IsNotEmpty()
  amount: number;
}
