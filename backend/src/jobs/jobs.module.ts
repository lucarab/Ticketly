import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Event } from '../events/entities/event.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [SequelizeModule.forFeature([Event, Ticket]), EventsModule],
  providers: [JobsService],
  controllers: [JobsController],
  exports: [JobsService],
})
export class JobsModule {}
