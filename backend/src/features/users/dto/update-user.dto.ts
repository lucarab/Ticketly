import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiPropertyOptional({ description: 'Vorname des Benutzers', example: 'Max' })
  firstname?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiPropertyOptional({
    description: 'Nachname des Benutzers',
    example: 'Mustermann',
  })
  lastname?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description: 'E-Mail-Adresse des Benutzers',
    example: 'max.mustermann@example.com',
  })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiPropertyOptional({
    description: 'Rolle des Benutzers',
    enum: UserRole,
    example: UserRole.MANAGER,
  })
  role?: UserRole;
}
