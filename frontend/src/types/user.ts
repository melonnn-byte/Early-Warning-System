export type UserRole = "admin" | "operator";

export type BackendUserRole = "SUPER_ADMIN" | "ADMIN" | "FIELD_OFFICER" | "USER";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  institution?: string | null;
  whatsappNumber?: string;
  role: UserRole;
}

export interface BackendAuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  institution?: string | null;
  role: BackendUserRole | string;
}
