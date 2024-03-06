import { IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @Expose()
  email: string;

  @IsNotEmpty()
  @Expose()
  firstName: string;

  @IsNotEmpty()
  @Expose()
  lastName: string;

  @IsNotEmpty()
  @Exclude()
  password: string;

  @Expose()
  phoneNumber: string;
}

export class UpdateUserDto {
  firstName: string;
  lastName: string;
}

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

export class PrivateUserDto extends UserDto {
  @Expose()
  id: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;
}
