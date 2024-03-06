import { describe, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let notificationsController: NotificationsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [NotificationsService],
    }).compile();

    notificationsController = app.get<NotificationsController>(
      NotificationsController,
    );
  });

  it('send an email notification', async () => {
    const result = await notificationsController.sendNotification({
      notification: {
        type: 'email',
        to: 'user@example.com',
        subject: 'Hello',
        message: 'Hello',
      },
    });

    expect(result).toEqual({ success: true });
  });

  it('send an sms notification', async () => {
    const result = await notificationsController.sendNotification({
      notification: {
        type: 'sms',
        to: '1234567890',
        message: 'Hello',
      },
    });
    expect(result).toEqual({ success: true });
  });
});
