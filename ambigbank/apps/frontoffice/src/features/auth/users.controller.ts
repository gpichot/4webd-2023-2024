import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ValidationPipe,
  UsePipes,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { plainToClass } from 'class-transformer';
import { createPasswordHash } from './utils';
import { CreateUserDto, PrivateUserDto, UpdateUserDto, UserDto } from './dtos';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get()
  async findAll() {
    const users = await this.userService.users({});

    return users.map((user) =>
      plainToClass(UserDto, user, { excludeExtraneousValues: true }),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.user({ id });
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @Post()
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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.updateUser({
      where: { id },
      data: updateUserDto,
    });
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.deleteUser({ id });
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }
}
