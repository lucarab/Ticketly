import { UserResponse } from './user.model';

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

export type LoginResponse = {
  user: UserResponse;
  access_token: string;
}

export type AuthState = {
  isAuthenticated: boolean;
  user: UserResponse | null;
  token: string | null;
}