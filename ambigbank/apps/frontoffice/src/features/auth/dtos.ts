import { IsNotEmpty, MinLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
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
  @Exclude()
  password: string;

  @ApiPropertyOptional()
  @Expose()
  phoneNumber: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @MinLength(1)
  firstName: string;

  @ApiPropertyOptional()
  @MinLength(1)
  lastName: string;
}

export class UserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;
}

export class PrivateUserDto extends UserDto {
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
