import { IsDecimal, IsNotEmpty, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  title: string;
}

export class PrivateBankAccountDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsDecimal()
  balance: string;
}

export class DepositDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  accountId: string;
}
