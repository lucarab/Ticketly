import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ description: 'Status- oder Erfolgsnachricht', example: 'Operation erfolgreich abgeschlossen' })
  message: string;
}