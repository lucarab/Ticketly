import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Ticket } from '../tickets/entities/ticket.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Ticket)
    private ticketModel: typeof Ticket,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('Benutzer mit dieser E-Mail-Adresse existiert bereits');
      }
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    const user = await this.userModel.create({
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      email: createUserDto.email,
      password: createUserDto.password,
      role: UserRole.USER,
    } as any);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('Benutzer nicht gefunden');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Benutzer nicht gefunden');
    }
    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (dto.email && dto.email !== user.email) {
      const existing = await this.userModel.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new ConflictException('E-Mail-Adresse wird bereits verwendet');
      }
    }
    if (dto.firstname !== undefined) (user as any).firstname = dto.firstname;
    if (dto.lastname !== undefined) (user as any).lastname = dto.lastname;
    if (dto.email !== undefined) (user as any).email = dto.email;
    if (dto.role !== undefined) (user as any).role = dto.role;
    await user.save();
    return user;
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto): Promise<User> {
    const user = await this.findById(userId);
    
    const isCurrentPasswordValid = await user.comparePassword(updatePasswordDto.currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Aktuelles Kennwort ist falsch');
    }

    user.password = updatePasswordDto.newPassword;
    await user.save();
    
    return user;
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.findById(userId);
    const sequelize = this.userModel.sequelize!;
    await sequelize.transaction(async (t) => {
      await this.ticketModel.destroy({ where: { userId }, transaction: t });
      await user.destroy({ transaction: t });
    });
  }
}
