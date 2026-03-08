import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(uid: string) {
        const user = await this.usersService.findByUid(uid);
        return { exists: !!user, user };
    }

    async register(data: {
        cedula: string;
        nombre: string;
        apellido: string;
        correo: string;
        telefono: string;
    }) {
        // Check if user already exists
        const existingUser = await this.usersService.findByUid(data.cedula);
        if (existingUser) {
            throw new ConflictException('El usuario ya existe');
        }

        // Map to Prisma model fields
        return this.usersService.create({
            uid: data.cedula,
            email: data.correo,
            first_name: data.nombre,
            last_name: data.apellido,
            phone: data.telefono,
            id_role: 2, // Assuming 2 is a default role (e.g. Patient/Regular User)
        });
    }
}
