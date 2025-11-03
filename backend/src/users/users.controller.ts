import { Controller, Get, Put, Delete, Body, Param, UseGuards, Request, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto, UserResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req): Promise<UserResponseDto> {
    const user = req.user as User;
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Put('password')
  async updatePassword(
    @Request() req,
    @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const user = req.user as User;
    await this.usersService.updatePassword(user.id, updatePasswordDto);
    return { message: 'Password updated successfully' };
  }

  @Delete('account')
  async deleteAccount(@Request() req): Promise<{ message: string }> {
    const user = req.user as User;
    await this.usersService.deleteUser(user.id);
    return { message: 'Account deleted successfully' };
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Get()
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(user => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}
