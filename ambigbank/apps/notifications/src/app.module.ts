import {
  Inject,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import {
  EmailNotification,
  NotificationsService,
  SMSNotification,
} from './notifications.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from '@ambigbank/services';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env.dev.global',
      load: [configuration],
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: QueueService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new QueueService(configService.get('services.queue.url'), [
          configService.get('services.queue.queue'),
        ]);
      },
    },
  ],
})
export class AppModule implements OnApplicationShutdown, OnModuleInit {
  @Inject(QueueService)
  private readonly queueService: QueueService;

  @Inject(NotificationsService)
  private readonly notificationService: NotificationsService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  async onModuleInit() {
    console.log('Connecting to queue');
    await this.queueService.connect();

    console.log('Starting to receive messages');
    this.queueService.receive(
      this.configService.get('services.queue.queue'),
      async (message: EmailNotification | SMSNotification) => {
        await this.notificationService.sendNotification(message);
      },
    );
  }

  onApplicationShutdown() {
    console.log('Closing queue');
    this.queueService.close();
  }
}
