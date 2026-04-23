import {
  Controller,
  Get,
} from '@nestjs/common';
import { ok } from '../common/api-response';
import { SensorsService } from './sensors.service';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  async findAll() {
    const data = await this.sensorsService.findAll();
    return ok(data);
  }
}
