import { IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TicketStatus } from '../entities/ticket.entity';

export class UpdateTicketDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'ID des Events', example: 1 })
  eventId?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'ID des Benutzers', example: 5 })
  userId?: number;

  @IsOptional()
  @IsEnum(TicketStatus)
  @ApiPropertyOptional({
    description: 'Status des Tickets',
    enum: Object.values(TicketStatus),
    example: TicketStatus.USED,
  })
  status?: TicketStatus;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Zeitpunkt der Nutzung',
    format: 'date-time',
    example: '2025-06-15T09:00:00.000Z',
  })
  usedAt?: string;
}
