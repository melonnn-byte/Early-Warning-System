import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as admin from 'firebase-admin';
import { PrismaService } from '../prisma/prisma.service';

interface LoginPayload {
  email: string;
  password: string;
}

// Interface baru untuk payload pendaftaran
interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

// Tambahkan interface ini agar TypeScript tahu isi dari token JWT
interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

// Interface untuk Firebase decoded token
interface FirebaseDecodedToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // --- FUNGSI REGISTER BARU ---
  async register(payload: RegisterPayload) {
    const email = payload.email.trim().toLowerCase();

    // Cek apakah email sudah dipakai
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar. Silakan login.');
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // Simpan ke database Prisma
    const newUser = await this.prisma.user.create({
      data: {
        email,
        name: payload.name,
        password: hashedPassword,
        // Role default, karena belum ada admin yang meng-approve
        role: UserRole.FIELD_OFFICER,
        isActive: true,
      },
    });

    return this.toPublicUser(newUser);
  }

  // --- FUNGSI LOGIN ---
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

  // --- FUNGSI REFRESH TOKEN ---
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

  // --- FUNGSI GOOGLE LOGIN ---
  async googleLogin(idToken: string) {
    try {
      // Verify Firebase ID token
      const decodedToken = (await admin
        .auth()
        .verifyIdToken(idToken)) as FirebaseDecodedToken;
      const { email, name } = decodedToken;

      if (!email) {
        throw new BadRequestException(
          'Email tidak ditemukan dalam token Google.',
        );
      }

      // Check if user exists
      let user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        // Create new user from Google account
        user = await this.prisma.user.create({
          data: {
            email: email.toLowerCase(),
            name: name || 'Google User',
            // No password for Google users
            password: '', // Empty password for OAuth users
            role: UserRole.FIELD_OFFICER,
            isActive: true,
            // Optional: store Firebase UID
            // firebaseUid: uid,
          },
        });
      } else if (!user.isActive) {
        throw new UnauthorizedException('Akun tidak aktif.');
      }

      return {
        accessToken: await this.buildToken(user, 900),
        refreshToken: await this.buildToken(user, 604800),
        user: this.toPublicUser(user),
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Token Google tidak valid.');
    }
  }

  // --- FUNGSI DEFAULT ADMIN ---
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

  // --- HELPER PUBLIC USER ---
  private toPublicUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  // --- HELPER BUILD TOKEN ---
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
