import {
  Inject,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';

import { CommonModule } from './services/common.module';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersApi } from '@ambigbank/client-users';
import configuration from './config/configuration';
import {
  BankAccountService,
  NotificationsService,
  UserService,
  QueueService,
  TransferAcknowledgedEvent,
} from '@ambigbank/services';
import { AccountsApi } from '@ambigbank/client-bank-accounts';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: '../../.env.dev.global',
      load: [configuration],
    }),
  ],
  controllers: [TransfersController],
  providers: [
    TransfersService,
    {
      provide: QueueService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new QueueService(configService.get('services.queue.url'), [
          configService.get('services.transfers.events.initiatedQueue'),
          configService.get('services.transfers.events.acknowledgedQueue'),
          configService.get('services.notifications.queue'),
        ]);
      },
    },
    {
      provide: UserService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const usersApi = new UsersApi({
          basePath: configService.get('services.users.url'),
          isJsonMime: () => true,
        });
        return new UserService(usersApi);
      },
    },
    {
      provide: BankAccountService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const accountsApi = new AccountsApi({
          basePath: configService.get('services.bankAccounts.url'),
          isJsonMime: () => true,
        });
        return new BankAccountService(accountsApi);
      },
    },
    NotificationsService,
  ],
})
export class AppModule implements OnApplicationShutdown, OnModuleInit {
  @Inject(QueueService)
  private readonly queueService: QueueService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(TransfersService)
  private readonly transfersService: TransfersService;

  async onModuleInit() {
    console.log('Connecting to queues');
    await this.queueService.connect();

    const transferAcknowledgedQueue = this.configService.get(
      'services.transfers.events.acknowledgedQueue',
    );
    this.queueService.receive(
      transferAcknowledgedQueue,
      async (message: TransferAcknowledgedEvent) => {
        console.log('Received transfer acknowledged event', message);

        this.transfersService.completeTransfer(message);
      },
    );
  }

  onApplicationShutdown() {
    console.log('Closing queues');
    this.queueService.close();
  }
}
