export type UserRole = "admin" | "operator";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  whatsappNumber?: string;
  role: UserRole;
}
