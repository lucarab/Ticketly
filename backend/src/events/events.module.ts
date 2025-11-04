import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';

@Module({
  imports: [SequelizeModule.forFeature([Event, Ticket])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [SequelizeModule, EventsService],
})
export class EventsModule {}
