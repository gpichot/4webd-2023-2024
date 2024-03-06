import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDecimal, IsNotEmpty, MinLength } from 'class-validator';

export class CreateBankAccountDto {
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
  id: string;
  title: string;

  @IsDecimal()
  @Type(() => DecimalNumber)
  balance: string;
}
