import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Name des Events',
    example: 'Tech Conference 2025',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Veranstaltungsort',
    example: 'Berlin, Stadthalle',
  })
  location?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Datum und Uhrzeit',
    format: 'date-time',
    example: '2025-06-15T09:00:00.000Z',
  })
  datetime?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Preis', example: 49.99 })
  price?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Maximale Anzahl an Tickets',
    example: 250,
  })
  maxTicketAmount?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Beschreibung des Events',
    example: 'Eine Konferenz für Entwickler und IT-Experten.',
  })
  description?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Status des Events',
    enum: Object.values(EventStatus),
    example: EventStatus.PUBLISHED,
  })
  @IsEnum(EventStatus)
  status?: EventStatus;
}
