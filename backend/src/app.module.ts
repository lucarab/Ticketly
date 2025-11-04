import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import { dataBaseConfig } from './database/database.config';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    SequelizeModule.forRoot(dataBaseConfig),
    UsersModule,
    AuthModule,
    DatabaseModule,
    EventsModule,
    TicketsModule,
    JobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
