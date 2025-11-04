import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Event } from '../events/entities/event.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket) private readonly ticketModel: typeof Ticket,
    @InjectModel(Event) private readonly eventModel: typeof Event,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const event = await this.eventModel.findByPk(dto.eventId);
    if (!event) throw new NotFoundException('Event not found');

    const user = await this.userModel.findByPk(dto.userId);
    if (!user) throw new NotFoundException('User not found');

    const data: Partial<Ticket> = {
      eventId: dto.eventId,
      userId: dto.userId,
    } as any;

    if (dto.status) (data as any).status = dto.status;
    if (dto.usedAt) {
      const usedAtDate = new Date(dto.usedAt);
      if (isNaN(usedAtDate.getTime())) {
        throw new BadRequestException('Invalid usedAt date');
      }
      (data as any).usedAt = usedAtDate;
    }

    return this.ticketModel.create(data as any);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketModel.findAll({
      include: [Event, User],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketModel.findByPk(id, { include: [Event, User] });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async update(id: number, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);

    const updateData: Partial<Ticket> = {} as any;

    if (dto.eventId !== undefined) {
      const event = await this.eventModel.findByPk(dto.eventId);
      if (!event) throw new NotFoundException('Event not found');
      (updateData as any).eventId = dto.eventId;
    }

    if (dto.userId !== undefined) {
      const user = await this.userModel.findByPk(dto.userId);
      if (!user) throw new NotFoundException('User not found');
      (updateData as any).userId = dto.userId;
    }

    if (dto.status !== undefined) {
      (updateData as any).status = dto.status;
    }

    if (dto.usedAt !== undefined) {
      const usedAtDate = dto.usedAt ? new Date(dto.usedAt) : null;
      if (dto.usedAt && usedAtDate && isNaN(usedAtDate.getTime())) {
        throw new BadRequestException('Invalid usedAt date');
      }
      (updateData as any).usedAt = usedAtDate as any;
    }

    await ticket.update(updateData);
    return ticket;
  }

  async remove(id: number): Promise<{ deleted: true }> {
    const ticket = await this.findOne(id);
    await ticket.destroy();
    return { deleted: true };
  }
}