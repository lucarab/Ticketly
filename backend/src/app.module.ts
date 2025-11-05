import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './features/events/events.module';
import { TicketsModule } from './features/tickets/tickets.module';
import { dataBaseConfig } from './database/database.config';
import { JobsModule } from './features/jobs/jobs.module';

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
