import { createParamDecorator } from '@nestjs/common';

export type AuthenticatedUser = {
  email: string;
  id: string;
};

export const AuthedUser = createParamDecorator((data, req) => {
  const user = req.user;

  return {
    ...user,
    id: user.sub,
  };
});
