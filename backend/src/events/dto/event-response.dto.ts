import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventStatus } from '../entities/event.entity';

export class EventResponseDto {
  @ApiProperty({ description: 'Eindeutige Event-ID', example: 42 })
  id: number;

  @ApiProperty({ description: 'Name des Events', example: 'Tech Conference 2025' })
  name: string;

  @ApiProperty({ description: 'Veranstaltungsort', example: 'Berlin, Stadthalle' })
  location: string;

  @ApiProperty({ description: 'Datum und Uhrzeit', example: '2025-06-15T09:00:00.000Z', format: 'date-time' })
  datetime: Date;

  @ApiProperty({ description: 'Preis', example: 49.99 })
  price: number;

  @ApiProperty({ description: 'Maximale Anzahl an Tickets', example: 250 })
  maxTicketAmount: number;

  @ApiPropertyOptional({ description: 'Beschreibung des Events', example: 'Eine Konferenz für Entwickler und IT-Experten.' })
  description?: string;

  @ApiProperty({ description: 'Status des Events', enum: ['draft', 'published', 'canceled'], example: 'draft' })
  status: EventStatus;

  @ApiProperty({ description: 'Erstellt am', example: '2025-05-01T10:00:00.000Z', format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: 'Aktualisiert am', example: '2025-05-10T12:00:00.000Z', format: 'date-time' })
  updatedAt: Date;
}