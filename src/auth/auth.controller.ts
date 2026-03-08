import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: { identityCard: string }) {
        return this.authService.validateUser(body.identityCard);
    }

    @Post('register')
    async register(@Body() body: {
        cedula: string;
        nombre: string;
        apellido: string;
        correo: string;
        telefono: string;
    }) {
        return this.authService.register(body);
    }
}
