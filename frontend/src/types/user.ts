export type UserRole = "admin" | "operator";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  whatsappNumber?: string;
  role: UserRole;
}
