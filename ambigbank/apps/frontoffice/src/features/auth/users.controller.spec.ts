import { describe, afterEach, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { CommonModule } from '../../services/common.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { BankAccountModule } from '../bank-accounts/bank-account.module';
import { NotificationsModule } from '../notifications/notifications.module';

describe('UsersController', () => {
  let userController: UsersController;
  const prisma = new PrismaClient();
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
        AuthModule,
        BankAccountModule,
        NotificationsModule,
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
        firstName: 'John',
        lastName: 'Doe',
      },
    ]);
  });
});
