import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AlertSeverity, UserRole } from '@prisma/client';
import { FirebaseService } from '../common/firebase/firebase.service';
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
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

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
    const safeLimit =
      Number.isNaN(limit) || limit < 1 ? 10 : Math.min(limit, 100);

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

  async getById(id: string) {
    const item = await this.prisma.alert.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!item) {
      throw new BadRequestException('Notifikasi tidak ditemukan.');
    }

    return item;
  }

  async broadcast(payload: BroadcastPayload) {
    if (
      !payload.title ||
      !payload.message ||
      !payload.severity ||
      !payload.channels?.length
    ) {
      throw new BadRequestException(
        'title, message, severity, dan channels wajib diisi.',
      );
    }

    const sender =
      (await this.prisma.user.findFirst({
        where: {
          isActive: true,
          role: UserRole.ADMIN,
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

    const shouldSendPush = payload.channels.some((channel) =>
      ['push', 'fcm', 'webpush', 'mobile'].includes(channel.toLowerCase()),
    );

    const pushTopic = shouldSendPush
      ? this.buildPushTopic(payload.targetArea)
      : null;
    let pushMessageId: string | null = null;
    let pushError: string | null = null;

    if (shouldSendPush && pushTopic) {
      try {
        pushMessageId = await this.firebaseService.sendToTopic(pushTopic, {
          title: payload.title,
          body: payload.message,
          data: {
            alertId: alert.id,
            severity: alert.severity,
            targetArea: alert.targetArea,
            sentAt: alert.sentAt.toISOString(),
          },
        });
      } catch (error) {
        pushError = error instanceof Error ? error.message : String(error);
        this.logger.error(
          `Failed to send FCM push for alert ${alert.id}: ${pushError}`,
        );
      }
    }

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
      pushDelivery: {
        enabled: this.firebaseService.isEnabled(),
        attempted: shouldSendPush,
        topic: pushTopic,
        messageId: pushMessageId,
        error: pushError,
      },
    };
  }

  async subscribePushToken(token: string, targetArea?: string) {
    if (!token?.trim()) {
      throw new BadRequestException('token FCM wajib diisi.');
    }

    if (!this.firebaseService.isEnabled()) {
      throw new BadRequestException(
        'Firebase belum terkonfigurasi di backend.',
      );
    }

    const topic = this.buildPushTopic(targetArea);
    const response = await this.firebaseService.subscribeTokenToTopic(
      token.trim(),
      topic,
    );

    return {
      topic,
      successCount: response?.successCount ?? 0,
      failureCount: response?.failureCount ?? 0,
      errors:
        response?.errors.map((item) => ({
          index: item.index,
          reason: item.error.message,
        })) ?? [],
    };
  }

  private buildPushTopic(targetArea?: string): string {
    const baseTopic = process.env.FCM_DEFAULT_TOPIC?.trim() || 'ews-alerts';

    if (!targetArea?.trim()) {
      return baseTopic;
    }

    const areaSlug = targetArea
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!areaSlug) {
      return baseTopic;
    }

    return `${baseTopic}-${areaSlug}`;
  }
}
