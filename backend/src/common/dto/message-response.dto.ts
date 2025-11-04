import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ description: 'Antwortnachricht', example: 'Passwort erfolgreich aktualisiert' })
  message!: string;
}