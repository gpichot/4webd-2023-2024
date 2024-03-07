import { describe, afterEach, beforeEach, it, expect, assert } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { CommonModule } from './services/common.module';
import { User } from 'db';
import { prisma } from 'db';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

describe('UsersController', () => {
  let userController: UsersController;
  let user: User;

  beforeEach(async () => {
    await prisma.bankAccount.deleteMany();
    await prisma.user.deleteMany();
    user = await prisma.user.create({
      data: {
        email: 'john@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      },
    });

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        ConfigModule,
        JwtModule.register({ secret: 'secret' }),
      ],
      controllers: [UsersController],
      providers: [UserService],
    }).compile();

    userController = app.get<UsersController>(UsersController);
  });

  afterEach(async () => {
    await prisma.bankAccount.deleteMany();
    await prisma.user.deleteMany();
  });

  it('can  sign up', async () => {
    const newUser = await userController.create({
      email: 'jane.doe@example.com',
      password: 'password',
      phoneNumber: '1234567890',
      firstName: 'Jane',
      lastName: 'Doe',
    });
    expect(newUser).toEqual({
      email: 'jane.doe@example.com',
      firstName: 'Jane',
      id: expect.any(String),
      lastName: 'Doe',
      phoneNumber: '1234567890',
      createdAt: expect.any(Date),
    });
  });

  it('lists users', async () => {
    const users = await userController.findAll();
    expect(users).toEqual([
      {
        id: expect.any(String),
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
    ]);
  });

  it.skip('can sign in', async () => {
    const result = await userController.signIn({
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
