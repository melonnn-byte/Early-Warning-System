import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlertsModule } from './alerts/alerts.module';
import { AuthModule } from './auth/auth.module';
import { EmergencyContactsModule } from './emergency-contacts/emergency-contacts.module';
import { HealthController } from './health/health.controller';
import { LocationsModule } from './locations/locations.module';
import { PrismaModule } from './prisma/prisma.module';
import { RainfallModule } from './rainfall/rainfall.module';
import { SensorsModule } from './sensors/sensors.module';
import { ThresholdsModule } from './thresholds/thresholds.module';
import { WaterLevelsModule } from './water-levels/water-levels.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    WaterLevelsModule,
    RainfallModule,
    SensorsModule,
    AlertsModule,
    ThresholdsModule,
    EmergencyContactsModule,
    LocationsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
