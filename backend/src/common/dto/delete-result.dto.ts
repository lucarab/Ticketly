import { ApiProperty } from '@nestjs/swagger';

export class DeleteResultDto {
  @ApiProperty({
    description: 'Gibt an, ob der Datensatz gelöscht wurde',
    example: true,
  })
  deleted!: boolean;
}
