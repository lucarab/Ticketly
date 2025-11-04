import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'Vorname des Benutzers', example: 'Max' })
  firstname: string;

  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'Nachname des Benutzers', example: 'Mustermann' })
  lastname: string;

  @IsEmail()
  @ApiProperty({ description: 'E-Mail-Adresse des Benutzers', example: 'max.mustermann@example.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'Passwort (min. 6 Zeichen)', example: 'Passwort123' })
  password: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Rolle des Benutzers', enum: ['admin', 'manager', 'user'], example: 'user' })
  @IsEnum(UserRole)
  role?: UserRole;
}