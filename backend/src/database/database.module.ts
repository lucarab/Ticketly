import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederService } from './seeder.service';
import { User } from '../features/users/entities/user.entity';
import { Event } from '../features/events/entities/event.entity';
import { Ticket } from '../features/tickets/entities/ticket.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Event, Ticket])],
  providers: [SeederService],
  exports: [SeederService],
})
export class DatabaseModule {}
