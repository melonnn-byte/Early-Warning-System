import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import {
  AlertSeverity,
  UserRole,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface BroadcastPayload {
  title: string;
  message: string;
  severity: AlertSeverity;
  channels: string[];
  targetArea?: string;
}

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActive() {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

    return this.prisma.alert.findMany({
      where: {
        sentAt: { gte: sixHoursAgo },
        severity: { in: [AlertSeverity.WARNING, AlertSeverity.DANGER] },
      },
      orderBy: { sentAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        message: true,
        severity: true,
        channels: true,
        targetArea: true,
        sentAt: true,
      },
    });
  }

  async getHistory(page = 1, limit = 10) {
    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = Number.isNaN(limit) || limit < 1 ? 10 : Math.min(limit, 100);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.alert.findMany({
        orderBy: { sentAt: 'desc' },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      this.prisma.alert.count(),
    ]);

    return {
      items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async broadcast(payload: BroadcastPayload) {
    if (!payload.title || !payload.message || !payload.severity || !payload.channels?.length) {
      throw new BadRequestException('title, message, severity, dan channels wajib diisi.');
    }

    const sender =
      (await this.prisma.user.findFirst({
        where: {
          isActive: true,
          role: { in: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
        },
        orderBy: { createdAt: 'asc' },
      })) ??
      (await this.prisma.user.create({
        data: {
          email: 'admin@ews.com',
          password: 'admin123',
          name: 'Admin EWS',
          role: UserRole.ADMIN,
          isActive: true,
        },
      }));

    const alert = await this.prisma.alert.create({
      data: {
        title: payload.title,
        message: payload.message,
        severity: payload.severity,
        channels: payload.channels,
        targetArea: payload.targetArea,
        sentBy: sender.id,
      },
    });

    return {
      id: alert.id,
      title: alert.title,
      message: alert.message,
      severity: alert.severity,
      channels: alert.channels,
      targetArea: alert.targetArea,
      sentAt: alert.sentAt,
      sentBy: {
        id: sender.id,
        name: sender.name,
        email: sender.email,
      },
    };
  }
}
