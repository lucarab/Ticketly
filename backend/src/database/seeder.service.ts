import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from '../features/users/entities/user.entity';
import { Event, EventStatus } from '../features/events/entities/event.entity';
import { Ticket, TicketStatus } from '../features/tickets/entities/ticket.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Event)
    private eventModel: typeof Event,
    @InjectModel(Ticket)
    private ticketModel: typeof Ticket,
  ) {}

  async seedDefaultUsers(): Promise<void> {
    try {
      this.logger.log('Datenbank-Seeding beginnt...');

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
          this.logger.log(`Benutzer erstellt: ${userData.email}`);
        } else {
          this.logger.log(`Benutzer existiert bereits: ${userData.email}`);
        }
      }

      const exampleEventData = {
        name: 'DHBW Demo Konzert',
        location: 'Aula',
        datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        price: 29.9,
        maxTicketAmount: 500,
        description: 'Willkommen zum DHBW-Demo-Konzert!',
        status: EventStatus.PUBLISHED,
      } as Partial<Event>;

      const existingEvent = await this.eventModel.findOne({
        where: { name: exampleEventData.name },
      });
      const event =
        existingEvent ??
        (await this.eventModel.create(exampleEventData as any));
      if (!existingEvent) {
        this.logger.log(`Beispiel-Event erstellt: ${event.name}`);
      } else {
        this.logger.log(
          `Beispiel-Event existiert bereits: ${existingEvent.name}`,
        );
      }

      const demoUser = await this.userModel.findOne({
        where: { email: 'user@ticketly.com' },
      });
      if (demoUser) {
        const existingTicket = await this.ticketModel.findOne({
          where: { userId: demoUser.id, eventId: event.id },
        });
        if (!existingTicket) {
          await this.ticketModel.create({
            eventId: event.id,
            userId: demoUser.id,
            status: TicketStatus.ACTIVE,
          } as any);
          this.logger.log(
            `Demo-Ticket erstellt für Benutzer ${demoUser.email} zu Event ${event.name}`,
          );
        } else {
          this.logger.log(
            `Demo-Ticket existiert bereits für Benutzer ${demoUser.email} zu Event ${event.name}`,
          );
        }
      }

      this.logger.log('Datenbank-Seeding erfolgreich');
    } catch (error) {
      this.logger.error('Fehler beim Datenbank-Seeding:', error);
      throw error;
    }
  }
}
