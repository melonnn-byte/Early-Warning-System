import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  User,
  UserRole,
} from '@prisma/client';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

interface LoginPayload {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(payload: LoginPayload) {
    const email = payload.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== payload.password || !user.isActive) {
      throw new UnauthorizedException('Email atau password tidak valid.');
    }

    return {
      accessToken: this.buildToken(user, 'access'),
      refreshToken: this.buildToken(user, 'refresh'),
      user: this.toPublicUser(user),
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token wajib diisi.');
    }

    const id = this.extractUserId(refreshToken);
    if (!id) {
      throw new UnauthorizedException('Refresh token tidak valid.');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User tidak ditemukan.');
    }

    return {
      accessToken: this.buildToken(user, 'access'),
      refreshToken: this.buildToken(user, 'refresh'),
    };
  }

  async ensureDefaultAdmin() {
    const email = 'admin@ews.com';
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      return;
    }

    await this.prisma.user.create({
      data: {
        email,
        password: 'admin123',
        name: 'Admin EWS',
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  private buildToken(user: User, kind: 'access' | 'refresh') {
    const raw = `${kind}:${user.id}:${user.email}:${Date.now()}`;
    return Buffer.from(raw).toString('base64url');
  }

  private extractUserId(token: string): string | null {
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf8');
      const parts = decoded.split(':');
      return parts[1] ?? null;
    } catch {
      return null;
    }
  }
}
