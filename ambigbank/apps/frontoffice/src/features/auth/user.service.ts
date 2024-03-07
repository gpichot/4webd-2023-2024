import {
  AccessTokenDto,
  CreateUserDto,
  SignInDto,
  UpdateUserDto,
  UserDto,
  UsersApi,
} from '@ambigbank/client-users';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly usersApi: UsersApi) {}

  async user(userId: string): Promise<UserDto | null> {
    const response = await this.usersApi.usersControllerFindOne(userId);

    return response.data;
  }

  async users({ email }: { email?: string } = {}): Promise<UserDto[]> {
    const response = await this.usersApi.usersControllerFindAll(email);

    return response.data;
  }

  async createUser(data: CreateUserDto): Promise<UserDto> {
    const response = await this.usersApi.usersControllerCreate(data);

    return response.data;
  }

  async updateUser(userId: string, params: UpdateUserDto): Promise<UserDto> {
    const response = await this.usersApi.usersControllerUpdate(userId, params);

    return response.data;
  }

  async deleteUser(userId: string): Promise<UserDto> {
    const response = await this.usersApi.usersControllerRemove(userId);

    return response.data;
  }

  async signIn(payload: SignInDto): Promise<AccessTokenDto> {
    const response = await this.usersApi.usersControllerSignIn(payload);

    return response.data;
  }
}
