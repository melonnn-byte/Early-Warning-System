import { PrismaService } from './src/prisma/prisma.service';

async function testPrismaService() {
  const prismaService = new PrismaService();

  try {
    console.log('Testing PrismaService connection...');
    const users = await prismaService.user.findMany();
    console.log(`✅ PrismaService connection successful! Found ${users.length} users.`);
  } catch (error: any) {
    console.error('❌ PrismaService connection failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await prismaService.$disconnect();
  }
}

testPrismaService();