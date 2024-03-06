import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthGuard } from './auth.guard';
import express from 'express';
import { AuthedUser, AuthenticatedUser } from './auth.decorator';
import { UserService } from './user.service';
import { plainToClass } from 'class-transformer';
import { PrivateUserDto } from './dtos';

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

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    const { email, password } = body;
    return this.authService.signIn(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@AuthedUser() user: AuthenticatedUser) {
    const finalUser = await this.userService.user({ id: user.id });

    return plainToClass(PrivateUserDto, finalUser, {
      excludeExtraneousValues: true,
    });
  }
}
