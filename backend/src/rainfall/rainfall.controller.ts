import { Controller, Get } from '@nestjs/common';
import { ok } from '../common/api-response';
import { RainfallService } from './rainfall.service';

@Controller('rainfall')
export class RainfallController {
  constructor(private readonly rainfallService: RainfallService) {}

  @Get('current')
  async getCurrent() {
    const data = await this.rainfallService.getCurrent();
    return ok(data);
  }
}
