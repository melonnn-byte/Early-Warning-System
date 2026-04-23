import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { AlertSeverity } from '@prisma/client';
import { ok } from '../common/api-response';
import { AlertsService } from './alerts.service';

interface BroadcastRequest {
  title: string;
  message: string;
  severity: AlertSeverity;
  channels: string[];
  targetArea?: string;
}

interface SubscribeRequest {
  token: string;
  targetArea?: string;
}

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get('active')
  async getActive() {
    const data = await this.alertsService.getActive();
    return ok(data);
  }

  @Post('broadcast')
  async broadcast(@Body() body: BroadcastRequest) {
    const data = await this.alertsService.broadcast(body);
    return ok(data);
  }

  @Post('subscribe')
  async subscribe(@Body() body: SubscribeRequest) {
    const data = await this.alertsService.subscribePushToken(body.token, body.targetArea);
    return ok(data);
  }

  @Get('history')
  async getHistory(@Query('page') page?: string, @Query('limit') limit?: string) {
    const data = await this.alertsService.getHistory(Number(page), Number(limit));
    return ok(data);
  }
}
