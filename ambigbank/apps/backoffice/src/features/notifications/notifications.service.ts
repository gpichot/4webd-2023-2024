import { Injectable } from '@nestjs/common';
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

    if (notification.type === 'email') {
      console.log(
        `Sending email to ${notification.to}: ${notification.subject}`,
      );
      return;
    }
    if (notification.type === 'sms') {
      console.log(`Sending SMS to ${notification.to}: ${notification.message}`);
    }
  }
}
