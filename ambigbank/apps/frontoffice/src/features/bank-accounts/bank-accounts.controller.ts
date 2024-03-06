import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { BankAccountService } from './bank-accounts.service';
import { CreateBankAccountDto, PrivateBankAccountDto } from './dtos';
import { Type, plainToClass } from 'class-transformer';
import { AuthGuard } from '../auth/auth.guard';

import { AuthedUser, AuthenticatedUser } from '../auth/auth.decorator';
import { Prisma } from '@prisma/client';

class DepositDto {
  @Type(() => Prisma.Decimal)
  amount: Prisma.Decimal;

  accountId: string;
}

@Controller('bank-accounts')
@UsePipes(new ValidationPipe({ transform: true }))
export class BankAccountsController {
  @Inject(BankAccountService)
  private readonly bankAccountService: BankAccountService;

  @Post()
  @UseGuards(AuthGuard)
  async createBankAccount(
    @AuthedUser() user: AuthenticatedUser,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ) {
    const result = await this.bankAccountService.createBankAccount({
      ...createBankAccountDto,
      balance: 0,
      user: { connect: { id: user.id } },
    });

    return plainToClass(PrivateBankAccountDto, result);
  }

  @Get()
  @UseGuards(AuthGuard)
  async listBankAccounts(@AuthedUser() user: AuthenticatedUser) {
    const result = await this.bankAccountService.listBankAccounts({
      where: { userId: user.id },
    });

    return result.map((bankAccount) =>
      plainToClass(PrivateBankAccountDto, bankAccount),
    );
  }

  @Post('deposit')
  @UseGuards(AuthGuard)
  async deposit(
    @AuthedUser() user: AuthenticatedUser,
    @Body() data: DepositDto,
  ) {
    const result = await this.bankAccountService.deposit({
      userId: user.id,
      accountId: data.accountId,
      amount: data.amount,
    });
    return plainToClass(PrivateBankAccountDto, result);
  }
}
