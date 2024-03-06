import { Module } from '@nestjs/common';
import { CommonModule } from 'src/services/common.module';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { BankAccountModule } from '../bank-accounts/bank-account.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [CommonModule, AuthModule, BankAccountModule, NotificationsModule],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransferModule {}
