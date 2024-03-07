import { Module } from '@nestjs/common';
import { CommonModule } from 'src/services/common.module';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { BankAccountModule } from '../bank-accounts/bank-account.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CommonModule,
    JwtModule,
    AuthModule,
    ConfigModule,
    BankAccountModule,
    NotificationsModule,
  ],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransferModule {}
