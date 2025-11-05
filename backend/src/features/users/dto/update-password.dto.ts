import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'Aktuelles Passwort zur Bestätigung',
    example: 'AltesPasswort123',
  })
  currentPassword: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'Neues Passwort (min. 6 Zeichen)',
    example: 'NeuesPasswort456',
  })
  newPassword: string;
}
