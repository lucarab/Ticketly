import { ApiProperty } from '@nestjs/swagger';

export class JobAcceptedResponseDto {
  @ApiProperty({ description: 'Status der Anfrage', example: 'accepted' })
  status: 'accepted';

  @ApiProperty({
    description: 'Job-ID',
    format: 'uuid',
    example: 'b9f6d5b2-0d61-4e13-9f4a-8f2f9cb6a123',
  })
  jobId: string;

  @ApiProperty({
    description: 'Status-URL zum Job',
    example: '/jobs/b9f6d5b2-0d61-4e13-9f4a-8f2f9cb6a123',
  })
  statusUrl: string;
}
