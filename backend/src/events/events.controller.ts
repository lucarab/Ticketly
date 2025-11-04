import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { EventResponseDto } from './dto/event-response.dto';

@ApiTags('Events')
@ApiBearerAuth()

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Event erstellen' })
  @ApiBody({ type: CreateEventDto })
  @ApiCreatedResponse({ description: 'Event erstellt', type: EventResponseDto })
  @ApiBadRequestResponse({ description: 'Ungültige Eingaben' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Alle Events abrufen' })
  @ApiOkResponse({ description: 'Liste der Events', type: EventResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Event per ID abrufen' })
  @ApiParam({ name: 'id', type: Number, description: 'Event-ID', example: 42 })
  @ApiOkResponse({ description: 'Event gefunden', type: EventResponseDto })
  @ApiNotFoundResponse({ description: 'Event nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Event aktualisieren' })
  @ApiParam({ name: 'id', type: Number, description: 'Event-ID', example: 42 })
  @ApiBody({ type: UpdateEventDto })
  @ApiOkResponse({ description: 'Event aktualisiert', type: EventResponseDto })
  @ApiBadRequestResponse({ description: 'Ungültige Eingaben' })
  @ApiNotFoundResponse({ description: 'Event nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Event löschen' })
  @ApiParam({ name: 'id', type: Number, description: 'Event-ID', example: 42 })
  @ApiNotFoundResponse({ description: 'Event nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}