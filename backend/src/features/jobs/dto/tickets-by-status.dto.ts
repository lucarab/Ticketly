import { ApiProperty } from '@nestjs/swagger';

export class TicketsByStatusDto {
  @ApiProperty({ description: 'Anzahl aktiver Tickets', example: 30 })
  active: number;

  @ApiProperty({ description: 'Anzahl verwendeter Tickets', example: 8 })
  used: number;

  @ApiProperty({ description: 'Anzahl stornierter Tickets', example: 2 })
  canceled: number;

  @ApiProperty({ description: 'Anzahl erstatteter Tickets', example: 2 })
  refunded: number;
}
