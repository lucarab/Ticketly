import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Benutzerdaten des eingeloggten Nutzers',
    example: {
      id: 1,
      firstname: 'Max',
      lastname: 'Mustermann',
      email: 'max.mustermann@example.com',
      role: 'user',
      createdAt: '2025-01-20T10:15:00.000Z',
      updatedAt: '2025-01-20T10:20:00.000Z',
    },
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'JWT Zugriffstoken',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}
