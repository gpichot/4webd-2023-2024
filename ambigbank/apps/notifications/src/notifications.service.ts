import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class Notification {}

export class SMSNotification extends Notification {
  @ApiProperty()
  type: 'sms';

  @ApiProperty()
  to: string;

  @ApiProperty()
  message: string;
}

export class EmailNotification extends Notification {
  @ApiProperty()
  type: 'email';

  @ApiProperty()
  to: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  message: string;
}

// };

@Injectable()
export class NotificationsService {
  async sendNotification(notification: EmailNotification | SMSNotification) {
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
