import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScanTicketDto {
  @IsUUID()
  @ApiProperty({
    description: 'UUID des Tickets',
    example: 'a3e1b2c4-5678-90ab-cdef-1234567890ab',
  })
  uuid!: string;
}
