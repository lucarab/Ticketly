export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: UserResponse;
  access_token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserResponse | null;
  token: string | null;
}