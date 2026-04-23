import { Module } from '@nestjs/common';
import { WaterLevelsController } from './water-levels.controller';
import { WaterLevelsService } from './water-levels.service';

@Module({
  controllers: [WaterLevelsController],
  providers: [WaterLevelsService],
})
export class WaterLevelsModule {}
