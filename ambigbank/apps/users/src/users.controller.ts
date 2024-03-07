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
  Query,
} from '@nestjs/common';
import { UserService } from './users.service';
import { plainToClass } from 'class-transformer';
import { createPasswordHash } from './utils';
import { CreateUserDto, PrivateUserDto, UpdateUserDto, UserDto } from './dtos';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

class UserSearchDto {
  @ApiPropertyOptional()
  @IsEmail()
  email?: string;
}

class SignInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

class AccessTokenDto {
  @ApiProperty()
  accessToken: string;
}

@ApiTags('users')
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  @Inject(UserService)
  private readonly userService: UserService;

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  @ApiOkResponse({ type: [UserDto] })
  async findAll(@Query() query: UserSearchDto = {}) {
    const users = await this.userService.users({
      where: query,
    });

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

  @ApiOperation({ summary: 'Update user' })
  @Patch(':id')
  @ApiOkResponse({ type: UserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.updateUser({
      where: { id },
      data: updateUserDto,
    });
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  @ApiOkResponse({ type: UserDto })
  async remove(@Param('id') id: string) {
    const user = await this.userService.deleteUser({ id });
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in' })
  @ApiOkResponse({ type: AccessTokenDto })
  async signIn(@Body() body: SignInDto) {
    const { email, password } = body;
    console.log('email', email);
    return this.userService.signIn(email, password);
  }
}
