import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async seedDefaultUsers(): Promise<void> {
    try {
      this.logger.log('Starting database seeding...');

      const defaultUsers = [
        {
          firstname: 'Admin',
          lastname: 'Demo',
          email: 'admin@ticketly.com',
          password: 'admin123',
          role: UserRole.ADMIN,
        },
        {
          firstname: 'Event',
          lastname: 'Demo',
          email: 'event@ticketly.com',
          password: 'event123',
          role: UserRole.MANAGER,
        },
        {
          firstname: 'User',
          lastname: 'Demo',
          email: 'user@ticketly.com',
          password: 'user123',
          role: UserRole.USER,
        },
      ];

      for (const userData of defaultUsers) {
        const existingUser = await this.userModel.findOne({
          where: { email: userData.email },
        });

        if (!existingUser) {
          await this.userModel.create(userData as any);
          this.logger.log(`Created default user: ${userData.email}`);
        } else {
          this.logger.log(`User already exists: ${userData.email}`);
        }
      }

      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Error during database seeding:', error);
      throw error;
    }
  }
}