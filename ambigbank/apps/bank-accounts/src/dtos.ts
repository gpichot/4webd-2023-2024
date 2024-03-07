import { Prisma } from 'db';
import { Type } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

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
  balance: Prisma.Decimal;

  @ApiProperty()
  @IsUUID()
  userId: string;
}

export class DepositDto {
  @ApiProperty({ type: String })
  @Type(() => Prisma.Decimal)
  amount: Prisma.Decimal;

  @ApiProperty()
  accountId: string;
}
