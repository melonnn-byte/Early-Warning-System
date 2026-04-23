import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmergencyContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.emergencyContact.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        phone: true,
        category: true,
        isActive: true,
      },
    });
  }
}
