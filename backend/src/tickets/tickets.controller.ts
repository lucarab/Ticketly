import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { TicketResponseDto } from './dto/ticket-response.dto';
import { ScanTicketDto } from './dto/scan-ticket.dto';
import { ScanTicketResponseDto } from './dto/scan-ticket-response.dto';
import { TicketStatus } from './entities/ticket.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { DeleteResultDto } from '../common/dto/delete-result.dto';

@ApiTags('Tickets')
@ApiBearerAuth()

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Ticket erstellen', description: 'Benutzer: nur eventId senden; userId wird vom Token gesetzt, Status automatisch "active". Administratoren/Manager: eventId und userId angeben; Status optional.' })
  @ApiBody({ type: CreateTicketDto, description: 'Rollenabhängige Anforderungen siehe Beschreibung' })
  @ApiCreatedResponse({ description: 'Ticket erstellt', type: TicketResponseDto })
  @ApiBadRequestResponse({ description: 'Ungültige Eingaben' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  create(@Request() req: any, @Body() dto: CreateTicketDto) {
    const isUser = String(req.user?.role || '').toLowerCase() === 'user';
    if (isUser) {
      dto.userId = req.user?.id;
      dto.status = TicketStatus.ACTIVE as any;
      delete (dto as any).usedAt;
    }
    return this.ticketsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Alle Tickets abrufen', description: 'Benutzer sehen nur eigene Tickets. Administratoren/Manager sehen alle Tickets.' })
  @ApiOkResponse({ description: 'Liste der Tickets', type: TicketResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  async findAll(@Request() req: any) {
    const tickets = await this.ticketsService.findAll();
    const isUser = String(req.user?.role || '').toLowerCase() === 'user';
    if (isUser) {
      const uid = req.user?.id;
      return (tickets || []).filter((t: any) => t?.userId === uid);
    }
    return tickets;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ticket per ID abrufen', description: 'Benutzer können nur eigene Tickets abrufen, sonst 403.' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket-ID', example: 42 })
  @ApiOkResponse({ description: 'Ticket gefunden', type: TicketResponseDto })
  @ApiNotFoundResponse({ description: 'Ticket nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  @ApiForbiddenResponse({ description: 'Nicht erlaubt für Benutzer (fremdes Ticket)' })
  async findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const ticket = await this.ticketsService.findOne(id);
    const isUser = String(req.user?.role || '').toLowerCase() === 'user';
    if (isUser) {
      const uid = req.user?.id;
      const ownerId = (ticket as any)?.userId ?? (ticket as any)?.User?.id ?? (ticket as any)?.user?.id;
      if (ownerId !== uid) {
        throw new ForbiddenException('Du darfst dieses Ticket nicht sehen.');
      }
    }
    return ticket;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Ticket aktualisieren', description: 'Nur Administratoren/Manager dürfen Tickets ändern. Benutzer erhalten 403.' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket-ID', example: 42 })
  @ApiBody({ type: UpdateTicketDto })
  @ApiOkResponse({ description: 'Ticket aktualisiert', type: TicketResponseDto })
  @ApiBadRequestResponse({ description: 'Ungültige Eingaben' })
  @ApiNotFoundResponse({ description: 'Ticket nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  @ApiForbiddenResponse({ description: 'Nicht erlaubt für Benutzer' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Ticket löschen', description: 'Nur Administratoren/Manager dürfen Tickets löschen. Benutzer erhalten 403.' })
  @ApiParam({ name: 'id', type: Number, description: 'Ticket-ID', example: 42 })
  @ApiOkResponse({ description: 'Ticket gelöscht', type: DeleteResultDto })
  @ApiNotFoundResponse({ description: 'Ticket nicht gefunden' })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  @ApiForbiddenResponse({ description: 'Nicht erlaubt für Benutzer' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.remove(id);
  }

  @Post('scan')
  @ApiOperation({ summary: 'Ticket per UUID scannen und validieren', description: 'Nur Administratoren/Manager dürfen Tickets scannen. Benutzer erhalten 403.' })
  @ApiBody({ type: ScanTicketDto })
  @ApiOkResponse({ description: 'Scan Ergebnis', type: ScanTicketResponseDto })
  @ApiUnauthorizedResponse({ description: 'Nicht autorisiert' })
  @ApiForbiddenResponse({ description: 'Nicht erlaubt für Benutzer' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  scan(@Request() req: any, @Body() dto: ScanTicketDto) {
    return this.ticketsService.scanByUuid(dto.uuid);
  }
}