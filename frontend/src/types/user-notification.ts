import type { UserRiskLevel } from "@/lib/utils";

export interface UserNotificationItem {
  id: string;
  sensorId: string;
  sensorName: string;
  levelCm: number;
  riskLevel: Exclude<UserRiskLevel, "normal">;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  guideHref: string;
  senderName: string;
  sourceType: "ADMIN" | "SYSTEM";
  channels: string[];
}
