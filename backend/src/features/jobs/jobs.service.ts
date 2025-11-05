import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from '../events/entities/event.entity';
import { Ticket, TicketStatus } from '../tickets/entities/ticket.entity';
import { EventsService } from '../events/services/events.service';
import { ReportJobResultDto } from './dto/job-report-result.dto';
import { EventDeleteResultDto } from './dto/job-event-delete-result.dto';

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface JobRecord {
  id: string;
  type: 'report' | 'event-delete';
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  payload?: { eventId: number };
  result?: ReportJobResultDto | EventDeleteResultDto | null;
  error?: string | null;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private readonly jobs = new Map<string, JobRecord>();

  constructor(
    @InjectModel(Event) private readonly eventModel: typeof Event,
    @InjectModel(Ticket) private readonly ticketModel: typeof Ticket,
    private readonly eventsService: EventsService,
  ) {}

  getJob(id: string): JobRecord | undefined {
    return this.jobs.get(id);
  }

  private save(job: JobRecord): void {
    this.jobs.set(job.id, job);
  }

  startReportJob(): JobRecord {
    const job: JobRecord = {
      id: randomUUID(),
      type: 'report',
      status: 'queued',
      createdAt: new Date(),
      updatedAt: new Date(),

      result: null,
      error: null,
    };
    this.save(job);

    setTimeout(async () => {
      job.status = 'running';
      job.updatedAt = new Date();
      this.save(job);

      try {
        const [
          eventsTotal,
          ticketsTotal,
          ticketsActive,
          ticketsUsed,
          ticketsCanceled,
          ticketsRefunded,
        ] = await Promise.all([
          this.eventModel.count(),
          this.ticketModel.count(),
          this.ticketModel.count({ where: { status: TicketStatus.ACTIVE } }),
          this.ticketModel.count({ where: { status: TicketStatus.USED } }),
          this.ticketModel.count({ where: { status: TicketStatus.CANCELED } }),
          this.ticketModel.count({ where: { status: TicketStatus.REFUNDED } }),
        ]);

        await new Promise((r) => setTimeout(r, 30000));

        job.result = {
          summary: {
            eventsTotal,
            ticketsTotal,
            ticketsByStatus: {
              active: ticketsActive,
              used: ticketsUsed,
              canceled: ticketsCanceled,
              refunded: ticketsRefunded,
            },
          },
        };
        job.status = 'completed';
        job.updatedAt = new Date();
        this.save(job);
      } catch (err: any) {
        job.status = 'failed';
        job.error = String(err?.message || err);
        job.updatedAt = new Date();
        this.save(job);
      }
    }, 500);

    return job;
  }

  startEventDeleteJob(eventId: number): JobRecord {
    const job: JobRecord = {
      id: randomUUID(),
      type: 'event-delete',
      status: 'queued',
      createdAt: new Date(),
      updatedAt: new Date(),
      payload: { eventId },
      result: null,
      error: null,
    };
    this.save(job);

    setTimeout(async () => {
      job.status = 'running';
      job.updatedAt = new Date();
      this.save(job);

      try {
        await new Promise((r) => setTimeout(r, 30000));
        const res = await this.eventsService.remove(eventId);
        job.result = res;
        job.status = 'completed';
        job.updatedAt = new Date();
        this.save(job);
      } catch (err: any) {
        job.status = 'failed';
        job.error = String(err?.message || err);
        job.updatedAt = new Date();
        this.save(job);
      }
    }, 500);

    return job;
  }
}
