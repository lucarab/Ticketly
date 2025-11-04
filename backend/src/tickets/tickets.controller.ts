import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { ScanTicketDto } from './dto/scan-ticket.dto';
import { ScanTicketResponseDto } from './dto/scan-ticket-response.dto';

@ApiTags('Tickets')
@ApiBearerAuth()

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Ticket erstellen' })
  @ApiBody({ type: CreateTicketDto })
  @ApiCreatedResponse({ description: 'Ticket erstellt', type: TicketResponseDto })
  @ApiBadRequestResponse({ description: 'Ungültige Eingaben' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Alle Tickets abrufen' })
  @ApiOkResponse({ description: 'Liste der Tickets', type: TicketResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ticket per ID abrufen' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket-ID', example: 42 })
  @ApiOkResponse({ description: 'Ticket gefunden', type: TicketResponseDto })
  @ApiNotFoundResponse({ description: 'Ticket nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Ticket aktualisieren' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket-ID', example: 42 })
  @ApiBody({ type: UpdateTicketDto })
  @ApiOkResponse({ description: 'Ticket aktualisiert', type: TicketResponseDto })
  @ApiBadRequestResponse({ description: 'Ungültige Eingaben' })
  @ApiNotFoundResponse({ description: 'Ticket nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Ticket löschen' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket-ID', example: 42 })
  @ApiNotFoundResponse({ description: 'Ticket nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.remove(id);
  }

  @Post('scan')
  @ApiOperation({ summary: 'Ticket per UUID scannen und validieren' })
  @ApiBody({ type: ScanTicketDto })
  @ApiOkResponse({ description: 'Scan Ergebnis', type: ScanTicketResponseDto })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  scan(@Body() dto: ScanTicketDto) {
    return this.ticketsService.scanByUuid(dto.uuid);
  }
}