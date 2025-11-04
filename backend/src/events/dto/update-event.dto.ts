import { IsString, IsDateString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  location?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  datetime?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  price?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  maxTicketAmount?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @ApiProperty()
  @IsEnum(EventStatus)
  status?: EventStatus;
}