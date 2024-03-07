import { Prisma } from 'db';
import { Type } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  title: string;
}

export class DecimalNumber extends Prisma.Decimal {
  constructor(value = 0) {
    super(value);
  }
}

export class PrivateBankAccountDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsDecimal()
  @Type(() => DecimalNumber)
  balance: string;
}

export class DepositDto {
  @ApiProperty()
  @Type(() => Prisma.Decimal)
  @IsNotEmpty()
  amount: Prisma.Decimal;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  accountId: string;
}
