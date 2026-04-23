-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'FIELD_OFFICER');

-- CreateEnum
CREATE TYPE "SensorType" AS ENUM ('WATER_LEVEL', 'RAINFALL');

-- CreateEnum
CREATE TYPE "SensorConnectivity" AS ENUM ('ONLINE', 'OFFLINE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "WaterLevelStatus" AS ENUM ('NORMAL', 'WARNING', 'DANGER');

-- CreateEnum
CREATE TYPE "RainfallIntensity" AS ENUM ('LIGHT', 'MODERATE', 'HEAVY');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'DANGER');

-- CreateEnum
CREATE TYPE "EmergencyCategory" AS ENUM ('BPBD', 'SAR', 'AMBULANCE', 'POLICE', 'HOSPITAL', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'FIELD_OFFICER',
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensors" (
    "id" TEXT NOT NULL,
    "sensor_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SensorType" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "battery_level" INTEGER,
    "connectivity" "SensorConnectivity" NOT NULL DEFAULT 'ONLINE',
    "installed_at" TIMESTAMP(3),
    "last_active_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sensors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_level_logs" (
    "id" TEXT NOT NULL,
    "sensor_id" TEXT NOT NULL,
    "water_level" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'meter',
    "status" "WaterLevelStatus" NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "water_level_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rainfall_logs" (
    "id" TEXT NOT NULL,
    "sensor_id" TEXT NOT NULL,
    "rainfall" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'mm/hour',
    "intensity" "RainfallIntensity" NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rainfall_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thresholds" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "normal_min" DOUBLE PRECISION NOT NULL,
    "normal_max" DOUBLE PRECISION NOT NULL,
    "warning_min" DOUBLE PRECISION NOT NULL,
    "warning_max" DOUBLE PRECISION NOT NULL,
    "danger_min" DOUBLE PRECISION NOT NULL,
    "danger_max" DOUBLE PRECISION,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "thresholds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "channels" JSONB NOT NULL,
    "target_area" TEXT,
    "sent_by" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "category" "EmergencyCategory" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sensors_sensor_id_key" ON "sensors"("sensor_id");

-- CreateIndex
CREATE INDEX "water_level_logs_sensor_id_recorded_at_idx" ON "water_level_logs"("sensor_id", "recorded_at");

-- CreateIndex
CREATE INDEX "rainfall_logs_sensor_id_recorded_at_idx" ON "rainfall_logs"("sensor_id", "recorded_at");

-- CreateIndex
CREATE UNIQUE INDEX "thresholds_type_key" ON "thresholds"("type");

-- AddForeignKey
ALTER TABLE "water_level_logs" ADD CONSTRAINT "water_level_logs_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "sensors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rainfall_logs" ADD CONSTRAINT "rainfall_logs_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "sensors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thresholds" ADD CONSTRAINT "thresholds_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_sent_by_fkey" FOREIGN KEY ("sent_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

