import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Type } from 'class-transformer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  EmailNotification,
  Notification,
  NotificationsService,
  SMSNotification,
} from './notifications.service';

class NotificationPayloadDto {
  @Type(() => Notification, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: EmailNotification, name: 'email' },
        { value: SMSNotification, name: 'sms' },
      ],
    },
  })
  notification: EmailNotification | SMSNotification;
}

@Controller('')
@ApiTags('Notifications')
export class NotificationsController {
  @Inject(NotificationsService)
  private readonly notificationService: NotificationsService;

  @ApiOperation({ summary: 'Send a notification' })
  @Post()
  async sendNotification(@Body() payload: NotificationPayloadDto) {
    await this.notificationService.sendNotification(payload.notification);

    return { success: true };
  }
}
