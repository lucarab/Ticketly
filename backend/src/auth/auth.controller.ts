import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { LoginResponseDto } from '../users/dto/login-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registriert neuen Benutzer und gibt Token zurück' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({
    description: 'Registrierung erfolgreich',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Ungültige Eingaben' })
  @ApiConflictResponse({ description: 'E-Mail bereits registriert' })
  async register(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<LoginResponseDto> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Meldet Benutzer an und gibt Token zurück' })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ description: 'Login erfolgreich', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Ungültige Anmeldedaten' })
  async login(
    @Body(ValidationPipe) loginUserDto: LoginUserDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginUserDto);
  }
}
