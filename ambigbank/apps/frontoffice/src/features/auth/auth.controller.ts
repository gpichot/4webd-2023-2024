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
import { AuthGuard } from './auth.guard';
import express from 'express';
import { AuthedUser, AuthenticatedUser } from './auth.decorator';
import { UserService } from './user.service';
import { plainToClass } from 'class-transformer';
import { PrivateUserDto } from './dtos';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInDto } from '@ambigbank/client-users';

export type RequestWithUser = express.Request & {
  user: { sub: string; email: string };
};

class AccessTokenDto {
  @ApiProperty()
  accessToken: string;
}

@ApiTags('auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  @Inject(UserService)
  private readonly userService: UserService;

  @ApiOperation({ summary: 'Get current profile' })
  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOkResponse({ type: PrivateUserDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getProfile(@AuthedUser() user: AuthenticatedUser) {
    const finalUser = await this.userService.user(user.id);

    return plainToClass(PrivateUserDto, finalUser, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Sign in' })
  @Post('sign-in')
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async signIn(@Body() payload: SignInDto) {
    return this.userService.signIn(payload);
  }
}
