import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

import { AuthedUser, AuthenticatedUser } from '../auth/auth.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBankAccountDto, DepositDto } from './dtos';
import { BankAccountService } from './bank-account.service';
import { PrivateBankAccountDto } from '@ambigbank/client-bank-accounts';

@ApiTags('bank-accounts')
@Controller('bank-accounts')
@UsePipes(new ValidationPipe({ transform: true }))
export class BankAccountsController {
  @Inject(BankAccountService)
  private readonly bankAccountService: BankAccountService;

  @ApiOperation({ summary: 'Create bank account' })
  @Post()
  @UseGuards(AuthGuard)
  async createBankAccount(
    @AuthedUser() user: AuthenticatedUser,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ) {
    return this.bankAccountService.createBankAccount({
      ...createBankAccountDto,
      userId: user.id,
    });
  }

  @ApiOperation({ summary: 'List bank accounts' })
  @Get()
  @UseGuards(AuthGuard)
  async listBankAccounts(
    @AuthedUser() user: AuthenticatedUser,
  ): Promise<PrivateBankAccountDto[]> {
    return this.bankAccountService.listBankAccountForUser(user.id);
  }

  @ApiOperation({ summary: 'Deposit' })
  @Post('deposit')
  @UseGuards(AuthGuard)
  async deposit(@Body() data: DepositDto) {
    return this.bankAccountService.deposit({
      accountId: data.accountId,
      amount: data.amount.toString(),
    });
  }
}
