import { create } from 'apisauce';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'db';

type EmailNotification = {
  type: 'email';
  to: string;
  subject: string;
  message: string;
};

type SMSNotification = {
  type: 'sms';
  to: string;
  message: string;
};

type AllNotification = {
  type: 'all';
  to: User;
  title: string;
  message: string;
};

export type Notification =
  | AllNotification
  | EmailNotification
  | SMSNotification;

@Injectable()
export class NotificationsService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async sendNotification(notification: Notification) {
    if (notification.type === 'all') {
      const { to } = notification;
      if (to.email) {
        this.sendNotification({
          type: 'email',
          to: notification.to.email,
          subject: notification.title,
          message: notification.message,
        });
      }
      if (to.phoneNumber) {
        this.sendNotification({
          type: 'sms',
          to: notification.to.phoneNumber,
          message: notification.message,
        });
      }

      return;
    }

    const notificationsUrl = this.configService.get(
      'services.notifications.url',
    );

    const api = create({ baseURL: notificationsUrl });
    const response = await api.post(notificationsUrl, { notification });

    if (!response.ok) {
      console.log('Failed to send notification', response.problem);
    }

    console.log('Notification sent', response.status);
    return;
  }
}
