import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeederService } from './seeder.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [SeederService],
  exports: [SeederService],
})
export class DatabaseModule {}