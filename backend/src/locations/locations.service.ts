import { Injectable } from '@nestjs/common';
import { SensorType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSensorLocations() {
    const sensors = await this.prisma.sensor.findMany({
      where: { isActive: true },
      orderBy: { sensorId: 'asc' },
    });

    return Promise.all(
      sensors.map(async (sensor) => {
        if (sensor.type === SensorType.WATER_LEVEL) {
          const latestWater = await this.prisma.waterLevelLog.findFirst({
            where: { sensorId: sensor.id },
            orderBy: { recordedAt: 'desc' },
            select: { waterLevel: true, status: true },
          });

          return {
            sensorId: sensor.sensorId,
            name: sensor.name,
            type: sensor.type,
            latitude: sensor.latitude,
            longitude: sensor.longitude,
            status: latestWater?.status ?? 'NORMAL',
            currentValue: latestWater?.waterLevel ?? 0,
          };
        }

        const latestRain = await this.prisma.rainfallLog.findFirst({
          where: { sensorId: sensor.id },
          orderBy: { recordedAt: 'desc' },
          select: { rainfall: true, intensity: true },
        });

        return {
          sensorId: sensor.sensorId,
          name: sensor.name,
          type: sensor.type,
          latitude: sensor.latitude,
          longitude: sensor.longitude,
          status: latestRain?.intensity ?? 'LIGHT',
          currentValue: latestRain?.rainfall ?? 0,
        };
      }),
    );
  }
}
