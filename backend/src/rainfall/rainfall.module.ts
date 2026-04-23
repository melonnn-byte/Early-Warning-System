import { Module } from '@nestjs/common';
import { RainfallController } from './rainfall.controller';
import { RainfallService } from './rainfall.service';

@Module({
  controllers: [RainfallController],
  providers: [RainfallService],
})
export class RainfallModule {}
