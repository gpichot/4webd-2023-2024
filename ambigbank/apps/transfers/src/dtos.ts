import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransferDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(1)
  @Expose()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @MinLength(1)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional()
  @Expose()
  phoneNumber: string;
}

export class UpdateTransferDto {
  @ApiPropertyOptional()
  @MinLength(1)
  firstName: string;

  @ApiPropertyOptional()
  @MinLength(1)
  lastName: string;
}

export class TransferDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @Expose()
  email: string;
}

export class PrivateTransferDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiPropertyOptional()
  @Expose()
  phoneNumber: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
