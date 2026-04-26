import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

dotenv.config();

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL not found in environment variables');
    return;
  }

  console.log('Testing database connection...');
  console.log('Connection string:', connectionString.replace(/:[^:]*@/, ':***@'));

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!');

    // Test a simple query
    const users = await prisma.user.findMany();
    console.log(`✅ Query successful! Found ${users.length} users in database.`);

  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testConnection();