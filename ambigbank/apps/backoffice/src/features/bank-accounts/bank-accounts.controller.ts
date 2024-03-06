import {
  Controller,
  Inject,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
} from '@nestjs/common';
import { BankAccountService } from './bank-accounts.service';
import { PrivateBankAccountDto } from './dtos';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from '../auth/auth.guard';

import { AuthedUser, AuthenticatedUser } from '../auth/auth.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('bank-accounts', 'users')
@Controller('/users/:userId/accounts')
@UsePipes(new ValidationPipe({ transform: true }))
export class BankAccountsController {
  @Inject(BankAccountService)
  private readonly bankAccountService: BankAccountService;

  @ApiOperation({ summary: 'List user bank accounts' })
  @Get()
  @UseGuards(AuthGuard)
  async listBankAccounts(
    @AuthedUser() user: AuthenticatedUser,
    @Param('userId') userId: string,
  ) {
    const result = await this.bankAccountService.listBankAccounts({
      where: { userId: userId },
    });

    return result.map((bankAccount) =>
      plainToClass(PrivateBankAccountDto, bankAccount),
    );
  }
}
