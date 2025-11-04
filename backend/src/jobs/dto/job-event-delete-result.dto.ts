import { ApiProperty } from '@nestjs/swagger';

export class EventDeleteResultDto {
  @ApiProperty({ description: 'Zeigt an, ob das Event gelöscht wurde', example: true })
  deleted: boolean;
}