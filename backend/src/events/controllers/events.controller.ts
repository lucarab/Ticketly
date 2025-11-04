import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { EventResponseDto } from '../dto/event-response.dto';
import { EventStatus } from '../entities/event.entity';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { UserRole } from '../../users/entities/user.entity';
import { DeleteResultDto } from '../../common/dto/delete-result.dto';

@ApiTags('Events')
@ApiBearerAuth()

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Event erstellen', description: 'Nur Administratoren/Manager können Events erstellen. Benutzer erhalten 403.' })
  @ApiBody({ type: CreateEventDto })
  @ApiCreatedResponse({ description: 'Event erstellt', type: EventResponseDto })
  @ApiBadRequestResponse({ description: 'Ungültige Eingaben' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  @ApiForbiddenResponse({ description: 'Nicht erlaubt für Benutzer' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Request() req: any, @Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Alle Events abrufen', description: 'Benutzer sehen nur veröffentlichte Events. Administratoren/Manager sehen alle.' })
  @ApiOkResponse({ description: 'Liste der Events', type: EventResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  async findAll(@Request() req: any) {
    const isUser = String(req.user?.role || '').toLowerCase() === 'user';
    if (isUser) {
      return this.eventsService.findPublished();
    }
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Event per ID abrufen', description: 'Benutzer können nur veröffentlichte Events sehen, sonst 403.' })
  @ApiParam({ name: 'id', type: Number, description: 'Event-ID', example: 42 })
  @ApiOkResponse({ description: 'Event gefunden', type: EventResponseDto })
  @ApiNotFoundResponse({ description: 'Event nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  @ApiForbiddenResponse({ description: 'Nicht erlaubt für Benutzer (nicht veröffentlicht)' })
  async findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.findOne(id);
    const isUser = String(req.user?.role || '').toLowerCase() === 'user';
    if (isUser && event?.status !== EventStatus.PUBLISHED) {
      throw new ForbiddenException('Du darfst dieses Event nicht sehen.');
    }
    return event;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Event aktualisieren', description: 'Nur Administratoren/Manager können Events bearbeiten. Benutzer erhalten 403.' })
  @ApiParam({ name: 'id', type: Number, description: 'Event-ID', example: 42 })
  @ApiBody({ type: UpdateEventDto })
  @ApiOkResponse({ description: 'Event aktualisiert', type: EventResponseDto })
  @ApiBadRequestResponse({ description: 'Ungültige Eingaben' })
  @ApiNotFoundResponse({ description: 'Event nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  @ApiForbiddenResponse({ description: 'Nicht erlaubt für Benutzer' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Event löschen', description: 'Nur Administratoren/Manager können Events löschen. Benutzer erhalten 403.' })
  @ApiParam({ name: 'id', type: Number, description: 'Event-ID', example: 42 })
  @ApiOkResponse({ description: 'Event gelöscht', type: DeleteResultDto })
  @ApiNotFoundResponse({ description: 'Event nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  @ApiForbiddenResponse({ description: 'Nicht erlaubt für Benutzer' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}