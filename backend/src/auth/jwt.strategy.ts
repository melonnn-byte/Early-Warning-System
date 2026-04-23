import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

// 1. Definisikan interface agar tidak ada lagi tipe 'any'
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      // Mengambil token dari header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Sebaiknya gunakan process.env.JWT_SECRET di production
      secretOrKey: process.env.JWT_SECRET || 'rahasia-super-kuat-ews-123',
    });
  }

  // 2. Ganti 'any' dengan tipe JwtPayload
  async validate(payload: JwtPayload) {
    // Sekarang TypeScript tahu bahwa payload pasti memiliki properti 'sub' bertipe string
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Akses ditolak atau user tidak aktif.');
    }

    // Mengembalikan user agar bisa diakses di controller (req.user)
    return user;
  }
}
