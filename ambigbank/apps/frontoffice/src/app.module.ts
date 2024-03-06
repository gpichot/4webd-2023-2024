import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonModule } from './services/common.module';
import { AuthModule } from './features/auth/auth.module';
import { BankAccountModule } from './features/bank-accounts/bank-account.module';
import { TransferModule } from './features/transfers/transfers.module';

@Module({
  imports: [CommonModule, AuthModule, BankAccountModule, TransferModule],
  providers: [AppService],
})
export class AppModule {}
