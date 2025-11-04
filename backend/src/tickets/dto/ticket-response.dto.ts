import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketStatus } from '../entities/ticket.entity';

export class TicketResponseDto {
  @ApiProperty({ description: 'Eindeutige Ticket-ID', example: 42 })
  id: number;

  @ApiProperty({ description: 'Eindeutige UUID des Tickets', example: 'a3e1b2c4-5678-90ab-cdef-1234567890ab' })
  uuid: string;

  @ApiProperty({ description: 'ID des Events', example: 1 })
  eventId: number;

  @ApiProperty({ description: 'ID des Benutzers', example: 5 })
  userId: number;

  @ApiProperty({ description: 'Status des Tickets', enum: Object.values(TicketStatus), example: TicketStatus.ACTIVE })
  status: TicketStatus;

  @ApiPropertyOptional({ description: 'Zeitpunkt der Nutzung', format: 'date-time', example: '2025-06-15T09:00:00.000Z' })
  usedAt?: Date;

  @ApiProperty({ description: 'Erstellt am', format: 'date-time', example: '2025-05-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Aktualisiert am', format: 'date-time', example: '2025-05-10T12:00:00.000Z' })
  updatedAt: Date;
}