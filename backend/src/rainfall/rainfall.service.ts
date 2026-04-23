import { Injectable } from '@nestjs/common';
import { SensorType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RainfallService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrent() {
    const sensors = await this.prisma.sensor.findMany({
      where: { type: SensorType.RAINFALL, isActive: true },
      orderBy: { sensorId: 'asc' },
    });

    const currentData = await Promise.all(
      sensors.map(async (sensor) => {
        const latest = await this.prisma.rainfallLog.findFirst({
          where: { sensorId: sensor.id },
          orderBy: { recordedAt: 'desc' },
        });

        if (!latest) {
          return null;
        }

        return {
          id: latest.id,
          sensorId: sensor.sensorId,
          sensorName: sensor.name,
          rainfall: latest.rainfall,
          unit: latest.unit,
          intensity: latest.intensity,
          latitude: sensor.latitude,
          longitude: sensor.longitude,
          recordedAt: latest.recordedAt,
        };
      }),
    );

    return currentData.filter((item) => item !== null);
  }
}
