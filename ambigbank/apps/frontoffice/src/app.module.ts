import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './services/common.module';
import { AuthModule } from './features/auth/auth.module';
import { BankAccountModule } from './features/bank-accounts/bank-account.module';

@Module({
  imports: [CommonModule, AuthModule, BankAccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
