import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SensorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sensor.findMany({
      where: { isActive: true },
      orderBy: { sensorId: 'asc' },
      select: {
        id: true,
        sensorId: true,
        name: true,
        type: true,
        latitude: true,
        longitude: true,
        batteryLevel: true,
        connectivity: true,
        lastActiveAt: true,
        installedAt: true,
      },
    });
  }
}
