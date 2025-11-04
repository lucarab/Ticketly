export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
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