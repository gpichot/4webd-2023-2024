import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty } from 'class-validator';
import express from 'express';
import { UserService } from './user.service';
import { PrivateUserDto } from './dtos';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

export type RequestWithUser = express.Request & {
  user: { sub: string; email: string };
};

class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

@ApiTags('auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(UserService)
  private readonly userService: UserService;

  @ApiOperation({ summary: 'Sign in' })
  @Post('sign-in')
  @ApiOkResponse({ type: PrivateUserDto })
  async signIn(@Body() body: SignInDto) {
    const { email, password } = body;
    return this.authService.signIn(email, password);
  }
}
