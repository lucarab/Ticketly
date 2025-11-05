import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketResponseDto } from './ticket-response.dto';

export class ScanTicketResponseDto {
  @ApiProperty({ description: 'Ob der Scan gültig ist', example: true })
  valid!: boolean;

  @ApiPropertyOptional({
    description: 'Ungültigkeitsgrund',
    example: 'already_used',
  })
  reason?: string;

  @ApiPropertyOptional({
    description: 'Ticketdaten (falls gefunden)',
    type: TicketResponseDto,
    example: {
      id: 42,
      uuid: 'a3e1b2c4-5678-90ab-cdef-1234567890ab',
      eventId: 1,
      userId: 5,
      status: 'active',
      usedAt: null,
      createdAt: '2025-05-01T10:00:00.000Z',
      updatedAt: '2025-05-10T12:00:00.000Z',
    },
  })
  ticket?: TicketResponseDto;
}
