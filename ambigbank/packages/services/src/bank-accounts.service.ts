import { Injectable } from "@nestjs/common";
import {
  AccountsApi,
  CreateBankAccountDto,
  DepositDto,
  PrivateBankAccountDto,
} from "@ambigbank/client-bank-accounts";

@Injectable()
export class BankAccountService {
  constructor(private readonly accountsApi: AccountsApi) {}

  async createBankAccount(createBankAccountDto: CreateBankAccountDto) {
    const response =
      await this.accountsApi.bankAccountsControllerCreateBankAccount({
        ...createBankAccountDto,
      });

    return response.data;
  }

  async getBankAccount(accountId: string): Promise<PrivateBankAccountDto> {
    const response =
      await this.accountsApi.bankAccountsControllerGetBankAccount(accountId);
    return response.data;
  }

  async listBankAccountForUser(
    userId?: string,
  ): Promise<PrivateBankAccountDto[]> {
    const response =
      await this.accountsApi.bankAccountsControllerListBankAccounts(userId);
    return response.data;
  }

  async deposit(data: DepositDto) {
    const response = await this.accountsApi.bankAccountsControllerDeposit(data);
    return response.data;
  }
}
