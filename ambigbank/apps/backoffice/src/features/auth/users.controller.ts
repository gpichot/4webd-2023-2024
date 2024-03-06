import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  UsePipes,
  Inject,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { plainToClass } from 'class-transformer';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { UserDto } from './dtos';

@ApiTags('users')
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  @Inject(UserService)
  private readonly userService: UserService;

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  @ApiOkResponse({ type: [UserDto] })
  @UseGuards(AuthGuard)
  async findAll() {
    const users = await this.userService.users({});

    return users.map((user) =>
      plainToClass(UserDto, user, { excludeExtraneousValues: true }),
    );
  }
}
