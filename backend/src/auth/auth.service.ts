import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

interface LoginPayload {
  email: string;
  password: string;
}

// Tambahkan interface ini agar TypeScript tahu isi dari token JWT
interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginPayload) {
    const email = payload.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email atau password tidak valid.');
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password tidak valid.');
    }

    return {
      // Menggunakan detik untuk menghindari error Type 'string'
      accessToken: await this.buildToken(user, 900), // 900 detik = 15 menit
      refreshToken: await this.buildToken(user, 604800), // 604800 detik = 7 hari
      user: this.toPublicUser(user),
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token wajib diisi.');
    }

    try {
      // Inject interface JwtPayload ke verifyAsync agar tidak 'any'
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: process.env.JWT_SECRET || 'rahasia-super-kuat-ews-123',
        },
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || !user.isActive) {
        throw new UnauthorizedException(
          'User tidak ditemukan atau tidak aktif.',
        );
      }

      return {
        accessToken: await this.buildToken(user, 900),
        refreshToken: await this.buildToken(user, 604800),
      };
    } catch {
      // Hapus deklarasi variabel (error) karena unused variable
      throw new UnauthorizedException(
        'Refresh token tidak valid atau kadaluarsa.',
      );
    }
  }

  async ensureDefaultAdmin() {
    const email = 'admin@ews.com';
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
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

  // Ubah parameter expiresIn menjadi number (satuan detik)
  private async buildToken(user: User, expiresInSeconds: number) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn: expiresInSeconds,
    });
  }
}
