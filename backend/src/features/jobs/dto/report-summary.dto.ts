import { ApiProperty } from '@nestjs/swagger';
import { TicketsByStatusDto } from './tickets-by-status.dto';

export class ReportSummaryDto {
  @ApiProperty({ description: 'Anzahl der Events insgesamt', example: 3 })
  eventsTotal: number;

  @ApiProperty({ description: 'Anzahl der Tickets insgesamt', example: 42 })
  ticketsTotal: number;

  @ApiProperty({
    description: 'Tickets nach Status',
    type: TicketsByStatusDto,
    example: { active: 30, used: 8, canceled: 2, refunded: 2 },
  })
  ticketsByStatus: TicketsByStatusDto;
}
