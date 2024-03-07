import { Injectable } from '@nestjs/common';
import {
  CreateTransferDto,
  TransferDto,
  TransfersApi,
} from '@ambigbank/client-transfers';

@Injectable()
export class TransfersService {
  private readonly transfersApi: TransfersApi;

  async createTransfer(data: CreateTransferDto): Promise<TransferDto> {
    const response =
      await this.transfersApi.transfersControllerCreateTransfer(data);

    return response.data;
  }
}
