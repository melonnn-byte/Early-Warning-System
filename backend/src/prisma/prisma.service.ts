import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    dotenv.config();

    const connectionString =
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/postgres';

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: ['warn', 'error'],
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
