import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  institution?: string;
  role?: UserRole;
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string | null;
  institution?: string | null;
  role?: UserRole;
  isActive?: boolean;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeRole(role?: UserRole): UserRole {
    if (!role) {
      return UserRole.USER;
    }

    if (role !== UserRole.ADMIN && role !== UserRole.USER) {
      throw new BadRequestException('Role hanya boleh ADMIN atau USER.');
    }

    return role;
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        institution: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async create(payload: CreateUserPayload) {
    const email = payload.email.trim().toLowerCase();
    const name = payload.name.trim();

    if (!name || !email || !payload.password) {
      throw new BadRequestException('name, email, dan password wajib diisi.');
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email sudah terdaftar.');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: payload.phone?.trim() || null,
        institution: payload.institution?.trim() || null,
        role: this.normalizeRole(payload.role),
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        institution: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, payload: UpdateUserPayload) {
    const data: UpdateUserPayload & { password?: string } = {
      name: payload.name?.trim(),
      email: payload.email?.trim().toLowerCase(),
      phone:
        payload.phone === undefined ? undefined : payload.phone?.trim() || null,
      institution:
        payload.institution === undefined
          ? undefined
          : payload.institution?.trim() || null,
      role:
        payload.role === undefined
          ? undefined
          : this.normalizeRole(payload.role),
      isActive: payload.isActive,
    };

    if (payload.password) {
      data.password = await bcrypt.hash(payload.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        institution: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { id };
  }
}
