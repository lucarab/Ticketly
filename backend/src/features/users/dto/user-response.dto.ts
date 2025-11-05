import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'Eindeutige Benutzer-ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Vorname des Benutzers', example: 'Max' })
  firstname: string;

  @ApiProperty({ description: 'Nachname des Benutzers', example: 'Mustermann' })
  lastname: string;

  @ApiProperty({
    description: 'E-Mail des Benutzers',
    example: 'max.mustermann@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Rolle des Benutzers',
    enum: ['admin', 'manager', 'user'],
    example: 'user',
  })
  role: UserRole;

  @ApiProperty({
    description: 'Erstellungsdatum',
    example: '2025-01-20T10:15:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Letzte Aktualisierung',
    example: '2025-01-20T10:20:00.000Z',
  })
  updatedAt: Date;
}
