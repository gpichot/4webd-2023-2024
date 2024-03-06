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
} from '@nestjs/common';
import { UserService } from './user.service';
import { plainToClass } from 'class-transformer';
import { createPasswordHash } from './utils';
import { CreateUserDto, PrivateUserDto, UserDto } from './dtos';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  @Inject(UserService)
  private readonly userService: UserService;

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  @ApiOkResponse({ type: [UserDto] })
  async findAll() {
    const users = await this.userService.users({});

    return users.map((user) =>
      plainToClass(UserDto, user, { excludeExtraneousValues: true }),
    );
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.user({ id });
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: 'Create user' })
  @Post()
  @ApiCreatedResponse({ type: PrivateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    const existingUser = await this.userService.user({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hash = await createPasswordHash(password);
    const user = await this.userService.createUser({
      ...rest,
      password: hash,
    });

    return plainToClass(PrivateUserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
