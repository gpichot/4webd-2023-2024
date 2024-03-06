import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { checkPasswordValid } from './utils';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async signIn(
    email: string,
    pass: string,
  ): Promise<{
    accessToken: string;
  }> {
    const user = await this.userService.user({ email: email });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await checkPasswordValid(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, sub: user.id };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
      }),
    };
  }
}
