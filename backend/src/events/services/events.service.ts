import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event, EventStatus } from '../entities/event.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event) private readonly eventModel: typeof Event,
    @InjectModel(Ticket) private readonly ticketModel: typeof Ticket,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const data: Partial<Event> = {
      name: dto.name,
      location: dto.location,
      datetime: new Date(dto.datetime),
      price: dto.price,
      maxTicketAmount: dto.maxTicketAmount,
      description: dto.description,
      status: dto.status,
    };
    return this.eventModel.create(data as any);
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.findAll({ order: [['datetime', 'ASC']] });
  }

  async findPublished(): Promise<Event[]> {
    return this.eventModel.findAll({
      where: { status: EventStatus.PUBLISHED },
      order: [['datetime', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventModel.findByPk(id);
    if (!event) throw new NotFoundException('Event nicht gefunden');
    return event;
  }

  async update(id: number, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    const updateData: Partial<Event> = { ...dto } as any;
    if (dto.datetime) {
      (updateData as any).datetime = new Date(dto.datetime);
    }
    await event.update(updateData);
    return event;
  }

  async remove(id: number): Promise<{ deleted: true }> {
    const event = await this.findOne(id);
    const sequelize = this.eventModel.sequelize!;
    await sequelize.transaction(async (t) => {
      await this.ticketModel.destroy({
        where: { eventId: id },
        transaction: t,
      });
      await event.destroy({ transaction: t });
    });
    return { deleted: true };
  }
}
