import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event) private readonly eventModel: typeof Event) {}

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

  async findOne(id: number): Promise<Event> {
    const event = await this.eventModel.findByPk(id);
    if (!event) throw new NotFoundException('Event not found');
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

  async remove(id: number): Promise<{ deleted: true }>
  {
    const event = await this.findOne(id);
    await event.destroy();
    return { deleted: true };
  }
}