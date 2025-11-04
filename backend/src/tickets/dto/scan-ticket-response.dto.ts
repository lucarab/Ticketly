import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketResponseDto } from './ticket-response.dto';

export class ScanTicketResponseDto {
  @ApiProperty({ description: 'Ob der Scan gültig ist', example: true })
  valid!: boolean;

  @ApiPropertyOptional({ description: 'Ungültigkeitsgrund', example: 'already_used' })
  reason?: string;

  @ApiPropertyOptional({ description: 'Ticketdaten (falls gefunden)', type: TicketResponseDto })
  ticket?: TicketResponseDto;
}