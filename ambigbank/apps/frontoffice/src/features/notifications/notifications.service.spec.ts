import {
  describe,
  it,
  expect,
  vitest,
  beforeEach,
  afterEach,
  SpyInstance,
} from 'vitest';

import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let consoleSpy: SpyInstance;

  beforeEach(() => {
    consoleSpy = vitest.spyOn(console, 'log');
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('send an email notification', async () => {
    const notificationsService = new NotificationsService();
    await notificationsService.sendNotification({
      type: 'email',
      to: 'john.doe@example.com',
      subject: 'Hello',
      message: 'Hello',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Sending email to john.doe@example.com: Hello',
    );
  });

  it('send an sms notification', async () => {
    const notificationsService = new NotificationsService();
    await notificationsService.sendNotification({
      type: 'sms',
      to: '1234567890',
      message: 'Hello',
    });
    expect(consoleSpy).toHaveBeenCalledWith('Sending SMS to 1234567890: Hello');
  });

  it('send an all notification', async () => {
    const notificationsService = new NotificationsService();
    await notificationsService.sendNotification({
      type: 'all',
      to: {
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
      },
      title: 'Hello',
      message: 'Hello',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Sending email to john.doe@example.com: Hello',
    );
    expect(consoleSpy).toHaveBeenCalledWith('Sending SMS to 1234567890: Hello');
  });
});
