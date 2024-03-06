import { createParamDecorator } from '@nestjs/common';

export type AuthenticatedUser = {
  email: string;
  id: string;
};

export const AuthedUser = createParamDecorator((data, context) => {
  const req = context.switchToHttp().getRequest();
  const user = req.user;

  return {
    ...user,
    id: user.sub,
  };
});
