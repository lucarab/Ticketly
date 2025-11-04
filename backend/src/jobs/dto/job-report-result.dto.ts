import { ApiProperty } from '@nestjs/swagger';
import { ReportSummaryDto } from './report-summary.dto';

export class ReportJobResultDto {
  @ApiProperty({ description: 'Zusammenfassung', type: ReportSummaryDto, example: { eventsTotal: 3, ticketsTotal: 42, ticketsByStatus: { active: 30, used: 8, canceled: 2, refunded: 2 } } })
  summary: ReportSummaryDto;
}