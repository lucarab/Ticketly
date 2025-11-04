import { Controller, Get, Put, Delete, Body, Param, UseGuards, Request, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto, UserResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { MessageResponseDto } from '../common/dto/message-response.dto';

@ApiTags('Users')
@ApiBearerAuth()

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Eigene Profilinformationen abrufen' })
  @ApiOkResponse({ description: 'Profil geladen', type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
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
  @ApiOperation({ summary: 'Passwort des eingeloggten Nutzers ändern' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiOkResponse({ description: 'Passwort aktualisiert', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Aktuelles Passwort ist falsch' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  async updatePassword(
    @Request() req,
    @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const user = req.user as User;
    await this.usersService.updatePassword(user.id, updatePasswordDto);
    return { message: 'Passwort erfolgreich aktualisiert' };
  }

  @Delete('account')
  @ApiOperation({ summary: 'Eigenes Konto löschen' })
  @ApiOkResponse({ description: 'Konto gelöscht', type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  async deleteAccount(@Request() req): Promise<{ message: string }> {
    const user = req.user as User;
    await this.usersService.deleteUser(user.id);
    return { message: 'Konto erfolgreich gelöscht' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Benutzer per ID abrufen' })
  @ApiParam({ name: 'id', type: Number, description: 'Benutzer-ID', example: 1 })
  @ApiOkResponse({ description: 'Benutzer gefunden', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Benutzer nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
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
  @ApiOperation({ summary: 'Alle Benutzer abrufen' })
  @ApiOkResponse({ description: 'Liste der Benutzer', type: UserResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
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
