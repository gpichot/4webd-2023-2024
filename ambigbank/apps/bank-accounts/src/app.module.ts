import {
  Inject,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';

import { CommonModule } from './services/common.module';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountService } from './bank-accounts.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService, TransferInitiatedEvent } from '@ambigbank/services';
import configuration from './config/configuration';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: '../../.env.dev.global',
      load: [configuration],
    }),
  ],
  controllers: [BankAccountsController],
  providers: [
    BankAccountService,
    {
      provide: QueueService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new QueueService(configService.get('services.queue.url'), [
          configService.get('services.transfers.events.initiatedQueue'),
          configService.get('services.transfers.events.acknowledgedQueue'),
        ]);
      },
    },
  ],
})
export class AppModule implements OnApplicationShutdown, OnModuleInit {
  @Inject(QueueService)
  private readonly queueService: QueueService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(BankAccountService)
  private readonly bankAccountService: BankAccountService;

  async onModuleInit() {
    console.log('Connecting to queue');
    await this.queueService.connect();

    console.log('Starting to receive messages');
    const transferInitiatedQueue = this.configService.get(
      'services.transfers.events.initiatedQueue',
    );
    this.queueService.receive(
      transferInitiatedQueue,
      async (message: TransferInitiatedEvent) => {
        console.log('Received transfer initiated event', message);
        this.bankAccountService.transfer(message);
      },
    );
  }

  onApplicationShutdown() {
    console.log('Closing queue');
    this.queueService.close();
  }
}
