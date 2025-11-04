import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederService } from './seeder.service';
import { User } from '../users/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { Ticket } from '../tickets/entities/ticket.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Event, Ticket])],
  providers: [SeederService],
  exports: [SeederService],
})
export class DatabaseModule {}