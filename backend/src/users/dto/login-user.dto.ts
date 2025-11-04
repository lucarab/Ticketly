import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'E-Mail-Adresse zum Anmelden',
    example: 'max.mustermann@example.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'Passwort des Benutzers',
    example: 'Passwort123',
  })
  password: string;
}
