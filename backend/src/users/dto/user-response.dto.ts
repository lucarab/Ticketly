import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class LoginResponseDto {
  user: UserResponseDto;
  access_token: string;
}