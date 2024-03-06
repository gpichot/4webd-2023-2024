import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { plainToClass } from 'class-transformer';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { TransferDto } from './dtos';

@ApiTags('transfers', 'users')
@Controller('users/:userId/transfers')
export class TransfersController {
  @Inject(TransfersService)
  private readonly transfersService: TransfersService;

  @ApiOperation({ summary: 'List all users transfer' })
  @Get()
  @ApiOkResponse({ type: [TransferDto] })
  @UseGuards(AuthGuard)
  async listTransfers(@Param('userId') userId: string) {
    const transfers = await this.transfersService.listTransfers({
      where: { OR: [{ toAccountId: userId }, { fromAccountId: userId }] },
    });

    return plainToClass(TransferDto, transfers, {
      excludeExtraneousValues: true,
    });
  }
}
