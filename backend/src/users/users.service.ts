import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto, UpdatePasswordDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
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
      role: createUserDto.role || UserRole.USER,
    } as any);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto): Promise<User> {
    const user = await this.findById(userId);
    
    const isCurrentPasswordValid = await user.comparePassword(updatePasswordDto.currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = updatePasswordDto.newPassword;
    await user.save();
    
    return user;
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.findById(userId);
    await user.destroy();
  }
}
