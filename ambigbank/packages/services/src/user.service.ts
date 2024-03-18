import { Injectable } from "@nestjs/common";
import { UsersApi, PrivateUserDto } from "@ambigbank/client-users";

@Injectable()
export class UserService {
  constructor(private readonly usersApi: UsersApi) {}

  async getUser(userId: string): Promise<PrivateUserDto> {
    const response = await this.usersApi.usersControllerFindOne(userId);

    return response.data;
  }
}
