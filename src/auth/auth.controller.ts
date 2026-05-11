import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: { identityCard: string }) {
        try {
            console.log('[DEBUG] Login attempt with identityCard:', body.identityCard);
            const result = await this.authService.validateUser(body.identityCard);
            console.log('[DEBUG] Login result:', result.exists ? 'User found' : 'User not found');
            return result;
        } catch (error) {
            console.error('[ERROR] Login failed:', error);
            throw error;
        }
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

    @Post('check-availability')
    @HttpCode(HttpStatus.OK)
    async checkAvailability(@Body() body: { field: string, value: string }) {
        const { field, value } = body;
        let exists = false;

        switch (field) {
            case 'cedula':
                const userUid = await this.authService.validateUser(value);
                exists = userUid.exists;
                break;
            case 'correo':
                // We need to add a method to AuthService or call UsersService directly
                // For simplicity, let's just use the validate logic if possible or add to AuthService
                const userEmail = await this.authService.checkEmail(value);
                exists = userEmail;
                break;
            case 'telefono':
                const userPhone = await this.authService.checkPhone(value);
                exists = userPhone;
                break;
        }

        return { available: !exists };
    }
}

