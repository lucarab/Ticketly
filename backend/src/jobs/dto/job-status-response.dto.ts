import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportJobResultDto } from './job-report-result.dto';
import { EventDeleteResultDto } from './job-event-delete-result.dto';

export class JobStatusResponseDto {
  @ApiProperty({ description: 'Gibt an, ob der Job existiert', example: true })
  exists: boolean;

  @ApiPropertyOptional({ description: 'Job-ID', format: 'uuid', example: 'b9f6d5b2-0d61-4e13-9f4a-8f2f9cb6a123' })
  id?: string;

  @ApiPropertyOptional({ description: 'Job-Typ', enum: ['report', 'event-delete'], example: 'report' })
  type?: 'report' | 'event-delete';

  @ApiPropertyOptional({ description: 'Job-Status', enum: ['queued', 'running', 'completed', 'failed', 'not_found'], example: 'queued' })
  status?: 'queued' | 'running' | 'completed' | 'failed' | 'not_found';

  @ApiPropertyOptional({ description: 'Erstellt am', format: 'date-time', example: '2025-05-01T10:00:00.000Z' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Aktualisiert am', format: 'date-time', example: '2025-05-10T12:00:00.000Z' })
  updatedAt?: Date;

  @ApiPropertyOptional({ description: 'Fehlermeldung (falls fehlgeschlagen)', example: null, nullable: true })
  error?: string | null;

  @ApiPropertyOptional({ description: 'Ergebnis des Jobs', type: Object, nullable: true, example: { deleted: true } })
  result?: ReportJobResultDto | EventDeleteResultDto | null;
}