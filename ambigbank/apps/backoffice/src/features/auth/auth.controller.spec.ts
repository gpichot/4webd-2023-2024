import { describe, afterEach, beforeEach, it, expect, assert } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { CommonModule } from '../../services/common.module';
import { AuthModule } from '../auth/auth.module';
import { User } from 'db';
import { prisma } from 'db';
import { BankAccountModule } from '../bank-accounts/bank-account.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthService } from './auth.service';
import { createPasswordHash } from './utils';

describe('AuthController', () => {
  let authController: AuthController;
  let user: User;

  beforeEach(async () => {
    await prisma.bankAccount.deleteMany();
    await prisma.user.deleteMany();
    user = await prisma.user.create({
      data: {
        email: 'john@example.com',
        password: await createPasswordHash('password'),
      },
    });

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        AuthModule,
        BankAccountModule,
        NotificationsModule,
      ],
      controllers: [AuthController],
      providers: [UserService, AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  afterEach(async () => {
    await prisma.bankAccount.deleteMany();
    await prisma.user.deleteMany();
  });

  it('can sign in', async () => {
    const result = await authController.signIn({
      email: 'john@example.com',
      password: 'password',
    });

    assert(result.accessToken);

    const token = result.accessToken.split('.')[1];

    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));

    expect(payload).toEqual({
      email: user.email,
      exp: expect.any(Number),
      iat: expect.any(Number),
      sub: user.id,
    });
  });
});
