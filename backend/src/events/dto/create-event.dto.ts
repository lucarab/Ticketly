import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name des Events', example: 'Tech Conference 2025' })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Veranstaltungsort', example: 'Berlin, Stadthalle' })
  location!: string;

  @IsDateString()
  @ApiProperty({ description: 'Datum und Uhrzeit', format: 'date-time', example: '2025-06-15T09:00:00.000Z' })
  datetime!: string;

  @IsNumber()
  @ApiProperty({ description: 'Preis', example: 49.99 })
  price!: number;

  @IsNumber()
  @ApiProperty({ description: 'Maximale Anzahl an Tickets', example: 250 })
  maxTicketAmount!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Beschreibung des Events', example: 'Eine Konferenz für Entwickler und IT-Experten.' })
  description?: string;

  @IsOptional()
  @ApiProperty({ description: 'Status des Events', enum: ['draft', 'published', 'canceled'], example: 'published' })
  @IsEnum(EventStatus)
  status?: EventStatus;
}