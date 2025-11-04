export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type RegisterRequest = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export type UserResponse = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type LoginResponse = {
  user: UserResponse;
  access_token: string;
}

export type AuthState = {
  isAuthenticated: boolean;
  user: UserResponse | null;
  token: string | null;
}