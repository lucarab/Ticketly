import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiAcceptedResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { JobAcceptedResponseDto } from './dto/job-accepted-response.dto';
import { JobStatusResponseDto } from './dto/job-status-response.dto';
import { ReportJobResultDto } from './dto/job-report-result.dto';
import { EventDeleteResultDto } from './dto/job-event-delete-result.dto';
import { ReportSummaryDto } from './dto/report-summary.dto';
import { TicketsByStatusDto } from './dto/tickets-by-status.dto';

@ApiTags('Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jobs')
@ApiExtraModels(
  JobAcceptedResponseDto,
  JobStatusResponseDto,
  ReportJobResultDto,
  EventDeleteResultDto,
  ReportSummaryDto,
  TicketsByStatusDto,
)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('reports')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Startet Report-Job (Statistiken ausgeben)',
    description:
      '30 Sekunden fiktive Jobdauer. Nur Administratoren können Jobs ausführen. Gibt 202 Accepted mit Job-ID und Status-URL zurück.',
  })
  @ApiAcceptedResponse({
    description: 'Job gestartet',
    schema: { $ref: getSchemaPath(JobAcceptedResponseDto) },
  })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  @ApiForbiddenResponse({ description: 'Nicht erlaubt für Manager/Benutzer' })
  @Roles(UserRole.ADMIN)
  startReport() {
    const job = this.jobsService.startReportJob();
    return {
      status: 'accepted',
      jobId: job.id,
      statusUrl: `/jobs/${job.id}`,
    };
  }

  @Post('events/:id/delete')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Startet Event-Lösch-Job (Event und zugehörige Tickets löschen)',
    description:
      '30 Sekunden fiktive Jobdauer. Nur Administratoren können Jobs ausführen. Gibt 202 Accepted mit Job-ID und Status-URL zurück.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Event-ID', example: 42 })
  @ApiAcceptedResponse({
    description: 'Job gestartet',
    schema: { $ref: getSchemaPath(JobAcceptedResponseDto) },
  })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  @ApiForbiddenResponse({ description: 'Nicht erlaubt für Manager/Benutzer' })
  @Roles(UserRole.ADMIN)
  startEventDelete(@Param('id', ParseIntPipe) id: number) {
    const job = this.jobsService.startEventDeleteJob(id);
    return {
      status: 'accepted',
      jobId: job.id,
      statusUrl: `/jobs/${job.id}`,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Jobstatus abrufen',
    description:
      'Nur Administratoren können Jobs abrufen. Gibt Status, Fehler und Ergebnis des Jobs zurück.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Job-ID',
    example: 'b9f6d5b2-0d61-4e13-9f4a-8f2f9cb6a123',
  })
  @ApiOkResponse({
    description: 'Jobstatus',
    schema: { $ref: getSchemaPath(JobStatusResponseDto) },
  })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  @ApiForbiddenResponse({ description: 'Nicht erlaubt für Manager/Benutzer' })
  @Roles(UserRole.ADMIN)
  getStatus(@Param('id') id: string) {
    const job = this.jobsService.getJob(id);
    if (!job) {
      return {
        exists: false,
        status: 'not_found',
      };
    }
    return {
      exists: true,
      id: job.id,
      type: job.type,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      error: job.error,
      result: job.result,
    };
  }
}
