import {
  Body,
  Controller,
  Get,
  Put,
} from '@nestjs/common';
import { ok } from '../common/api-response';
import { ThresholdsService } from './thresholds.service';

interface UpdateThresholdRequest {
  waterLevel?: {
    normal: { min: number; max: number };
    warning: { min: number; max: number };
    danger: { min: number; max: number | null };
  };
  rainfall?: {
    light: { min: number; max: number };
    moderate: { min: number; max: number };
    heavy: { min: number; max: number | null };
  };
}

@Controller('thresholds')
export class ThresholdsController {
  constructor(private readonly thresholdsService: ThresholdsService) {}

  @Get()
  async getCurrent() {
    const data = await this.thresholdsService.getCurrent();
    return ok(data);
  }

  @Put()
  async update(@Body() body: UpdateThresholdRequest) {
    const data = await this.thresholdsService.update(body);
    return ok(data);
  }
}
