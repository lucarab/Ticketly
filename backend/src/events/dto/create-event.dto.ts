import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location!: string;

  @IsDateString()
  @ApiProperty()
  datetime!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  price!: string;

  @IsNumber()
  @ApiProperty()
  maxTicketAmount!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @ApiProperty({ description: 'Status des Events', enum: ['draft', 'published', 'canceled'], example: 'published' })
  @IsEnum(EventStatus)
  status?: EventStatus;
}