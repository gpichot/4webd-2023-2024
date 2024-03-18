import { Injectable } from '@nestjs/common';
import {
  CreateTransferDto,
  TransferDto,
  TransfersApi,
} from '@ambigbank/client-transfers';

@Injectable()
export class TransfersService {
  constructor(private readonly transfersApi: TransfersApi) {}

  async createTransfer(data: CreateTransferDto): Promise<TransferDto> {
    const response =
      await this.transfersApi.transfersControllerCreateTransfer(data);

    return response.data;
  }

  async listTransfers(): Promise<TransferDto[]> {
    const response = await this.transfersApi.transfersControllerListTransfers();
    return response.data;
  }
}
