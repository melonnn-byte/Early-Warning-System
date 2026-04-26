import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  EmergencyCategory,
  PrismaClient,
  RainfallIntensity,
  SensorConnectivity,
  SensorType,
  UserRole,
  WaterLevelStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5432/postgres';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function upsertUsers() {
  const users = [
    {
      email: 'admin@ews.com',
      name: 'Admin EWS',
      password: 'Admin123!',
      role: UserRole.ADMIN,
      institution: 'BPBD Kota',
      phone: '6281110000001',
    },
    {
      email: 'admin2@ews.com',
      name: 'Admin Operasional EWS',
      password: 'AdminOps123!',
      role: UserRole.ADMIN,
      institution: 'BPBD Kota',
      phone: '6281110000002',
    },
    {
      email: 'user1@ews.com',
      name: 'User Warga 1',
      password: 'User12345!',
      role: UserRole.USER,
      institution: 'Warga Padang Barat',
      phone: '6281110000003',
    },
    {
      email: 'user2@ews.com',
      name: 'User Warga 2',
      password: 'User12345!',
      role: UserRole.USER,
      institution: 'Warga Padang Utara',
      phone: '6281110000004',
    },
    {
      email: 'user3@ews.com',
      name: 'User Warga 3',
      password: 'User12345!',
      role: UserRole.USER,
      institution: 'Warga Nanggalo',
      phone: '6281110000007',
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role,
        institution: user.institution,
        phone: user.phone,
        isActive: true,
      },
      update: {
        name: user.name,
        password: hashedPassword,
        role: user.role,
        institution: user.institution,
        phone: user.phone,
        isActive: true,
      },
    });
  }
}

async function upsertSensors() {
  const sensors = [
    {
      sensorId: 'EWS-WL-001',
      name: 'Sensor Hulu Batang Arau',
      type: SensorType.WATER_LEVEL,
      latitude: -0.9512,
      longitude: 100.3608,
      batteryLevel: 88,
      connectivity: SensorConnectivity.ONLINE,
    },
    {
      sensorId: 'EWS-WL-002',
      name: 'Sensor Tengah Batang Arau',
      type: SensorType.WATER_LEVEL,
      latitude: -0.9584,
      longitude: 100.3701,
      batteryLevel: 76,
      connectivity: SensorConnectivity.ONLINE,
    },
    {
      sensorId: 'EWS-WL-003',
      name: 'Sensor Hilir Batang Arau',
      type: SensorType.WATER_LEVEL,
      latitude: -0.9688,
      longitude: 100.3833,
      batteryLevel: 59,
      connectivity: SensorConnectivity.ONLINE,
    },
    {
      sensorId: 'EWS-RF-001',
      name: 'Rain Gauge Padang Barat',
      type: SensorType.RAINFALL,
      latitude: -0.9497,
      longitude: 100.3655,
      batteryLevel: 83,
      connectivity: SensorConnectivity.ONLINE,
    },
    {
      sensorId: 'EWS-RF-002',
      name: 'Rain Gauge Padang Utara',
      type: SensorType.RAINFALL,
      latitude: -0.9441,
      longitude: 100.3744,
      batteryLevel: 71,
      connectivity: SensorConnectivity.ONLINE,
    },
  ];

  for (const sensor of sensors) {
    await prisma.sensor.upsert({
      where: { sensorId: sensor.sensorId },
      create: {
        ...sensor,
        isActive: true,
        installedAt: new Date(),
        lastActiveAt: new Date(),
      },
      update: {
        ...sensor,
        isActive: true,
        lastActiveAt: new Date(),
      },
    });
  }
}

async function upsertThresholds() {
  await prisma.threshold.upsert({
    where: { type: 'water_level' },
    create: {
      type: 'water_level',
      normalMin: 0,
      normalMax: 150,
      warningMin: 151,
      warningMax: 220,
      dangerMin: 221,
      dangerMax: null,
    },
    update: {
      normalMin: 0,
      normalMax: 150,
      warningMin: 151,
      warningMax: 220,
      dangerMin: 221,
      dangerMax: null,
    },
  });

  await prisma.threshold.upsert({
    where: { type: 'rainfall' },
    create: {
      type: 'rainfall',
      normalMin: 0,
      normalMax: 5,
      warningMin: 5.1,
      warningMax: 20,
      dangerMin: 20.1,
      dangerMax: null,
    },
    update: {
      normalMin: 0,
      normalMax: 5,
      warningMin: 5.1,
      warningMax: 20,
      dangerMin: 20.1,
      dangerMax: null,
    },
  });
}

async function upsertEmergencyContacts() {
  const contacts = [
    {
      name: 'BPBD Kota Padang',
      phone: '117',
      category: EmergencyCategory.BPBD,
    },
    {
      name: 'Basarnas',
      phone: '115',
      category: EmergencyCategory.SAR,
    },
    {
      name: 'Ambulans',
      phone: '118',
      category: EmergencyCategory.AMBULANCE,
    },
    {
      name: 'Polisi',
      phone: '110',
      category: EmergencyCategory.POLICE,
    },
    {
      name: 'RS Umum Daerah',
      phone: '119',
      category: EmergencyCategory.HOSPITAL,
    },
  ];

  for (const contact of contacts) {
    const existing = await prisma.emergencyContact.findFirst({
      where: {
        name: contact.name,
        phone: contact.phone,
      },
    });

    if (existing) {
      await prisma.emergencyContact.update({
        where: { id: existing.id },
        data: {
          category: contact.category,
          isActive: true,
        },
      });
    } else {
      await prisma.emergencyContact.create({
        data: {
          ...contact,
          isActive: true,
        },
      });
    }
  }
}

async function seedSensorLogs() {
  const waterSensors = await prisma.sensor.findMany({
    where: {
      isActive: true,
      type: SensorType.WATER_LEVEL,
    },
    select: {
      id: true,
      sensorId: true,
    },
  });

  const rainfallSensors = await prisma.sensor.findMany({
    where: {
      isActive: true,
      type: SensorType.RAINFALL,
    },
    select: {
      id: true,
      sensorId: true,
    },
  });

  if (waterSensors.length > 0) {
    await prisma.waterLevelLog.deleteMany({
      where: {
        sensorId: {
          in: waterSensors.map((sensor) => sensor.id),
        },
      },
    });
  }

  if (rainfallSensors.length > 0) {
    await prisma.rainfallLog.deleteMany({
      where: {
        sensorId: {
          in: rainfallSensors.map((sensor) => sensor.id),
        },
      },
    });
  }

  for (const [sensorIndex, sensor] of waterSensors.entries()) {
    const rows = Array.from({ length: 24 }, (_, idx) => {
      const baseLevel = 120 + sensorIndex * 20;
      const waterLevel = baseLevel + ((idx % 6) - 2) * 7;
      const status =
        waterLevel >= 221
          ? WaterLevelStatus.DANGER
          : waterLevel >= 151
            ? WaterLevelStatus.WARNING
            : WaterLevelStatus.NORMAL;

      return {
        sensorId: sensor.id,
        waterLevel,
        status,
        unit: 'cm',
        recordedAt: new Date(Date.now() - (24 - idx) * 60 * 60 * 1000),
      };
    });

    await prisma.waterLevelLog.createMany({ data: rows });
  }

  for (const [sensorIndex, sensor] of rainfallSensors.entries()) {
    const rows = Array.from({ length: 24 }, (_, idx) => {
      const rainfall = 2 + sensorIndex * 3 + (idx % 5) * 1.8;
      const intensity =
        rainfall > 20
          ? RainfallIntensity.HEAVY
          : rainfall > 5
            ? RainfallIntensity.MODERATE
            : RainfallIntensity.LIGHT;

      return {
        sensorId: sensor.id,
        rainfall,
        intensity,
        unit: 'mm/hour',
        recordedAt: new Date(Date.now() - (24 - idx) * 60 * 60 * 1000),
      };
    });

    await prisma.rainfallLog.createMany({ data: rows });
  }
}

async function main() {
  await upsertUsers();
  await upsertSensors();
  await upsertThresholds();
  await upsertEmergencyContacts();
  await seedSensorLogs();

  console.log(
    'Seed selesai: users, sensors, thresholds, emergency contacts, dan sensor logs berhasil dibuat.',
  );
  console.log('Akun cepat login:');
  console.log('- admin@ews.com / Admin123!');
  console.log('- admin2@ews.com / AdminOps123!');
  console.log('- user1@ews.com / User12345!');
  console.log('- user2@ews.com / User12345!');
  console.log('- user3@ews.com / User12345!');
}

void main()
  .catch((error) => {
    console.error('Seed gagal:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
