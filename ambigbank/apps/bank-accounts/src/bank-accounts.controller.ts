import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { BankAccountService } from './bank-accounts.service';
import {
  CreateBankAccountDto,
  DepositDto,
  PrivateBankAccountDto,
} from './dtos';
import { plainToClass } from 'class-transformer';

import {
  ApiOkResponse,
  ApiOperation,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

class SearchDto {
  @ApiPropertyOptional()
  @IsUUID()
  userId?: string;
}

@ApiTags('accounts')
@Controller('accounts')
@UsePipes(new ValidationPipe({ transform: true }))
export class BankAccountsController {
  @Inject(BankAccountService)
  private readonly bankAccountService: BankAccountService;

  @ApiOperation({ summary: 'Create bank account' })
  @Post()
  @ApiOkResponse({ type: [PrivateBankAccountDto] })
  async createBankAccount(@Body() createBankAccountDto: CreateBankAccountDto) {
    const { userId, ...payload } = createBankAccountDto;
    const result = await this.bankAccountService.createBankAccount({
      ...payload,
      balance: 0,
      user: { connect: { id: userId } },
    });

    return plainToClass(PrivateBankAccountDto, result);
  }

  @ApiOperation({ summary: 'List bank accounts' })
  @Get()
  @ApiOkResponse({ type: [PrivateBankAccountDto] })
  async listBankAccounts(@Query() search?: SearchDto) {
    const result = await this.bankAccountService.listBankAccounts({
      where: search,
    });

    return result.map((bankAccount) =>
      plainToClass(PrivateBankAccountDto, bankAccount),
    );
  }

  @Get(':accountId')
  @ApiOperation({ summary: 'Get bank account by ID' })
  @ApiOkResponse({ type: PrivateBankAccountDto })
  async getBankAccount(@Param('accountId') accountId: string) {
    const result = await this.bankAccountService.getBankAccount({
      where: { id: accountId },
    });
    return plainToClass(PrivateBankAccountDto, result);
  }

  @ApiOperation({ summary: 'Deposit' })
  @Post('deposit')
  @ApiOkResponse({ type: PrivateBankAccountDto })
  async deposit(@Body() data: DepositDto) {
    const result = await this.bankAccountService.deposit({
      accountId: data.accountId,
      amount: data.amount,
    });
    return plainToClass(PrivateBankAccountDto, result);
  }
}
