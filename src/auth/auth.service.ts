import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(uid: string) {
        const user = await this.usersService.findByUid(uid);
        return { exists: !!user, user };
    }

    async checkEmail(email: string) {
        const user = await this.usersService.findByEmail(email);
        return !!user;
    }

    async checkPhone(phone: string) {
        const user = await this.usersService.findByPhone(phone);
        return !!user;
    }


    async register(data: {
        cedula: string;
        nombre: string;
        apellido: string;
        correo: string;
        telefono: string;
    }) {
        // Check if user already exists by UID
        const existingUserByUid = await this.usersService.findByUid(data.cedula);
        if (existingUserByUid) {
            throw new ConflictException('El usuario con esta cédula ya existe');
        }

        // Check if email already exists
        const existingUserByEmail = await this.usersService.findByEmail(data.correo);
        if (existingUserByEmail) {
            throw new ConflictException('El correo electrónico ya está en uso');
        }

        // Check if phone already exists
        const existingUserByPhone = await this.usersService.findByPhone(data.telefono);
        if (existingUserByPhone) {
            throw new ConflictException('El número de teléfono ya está en uso');
        }



        // Map to Prisma model fields
        return this.usersService.create({
            uid: data.cedula,
            email: data.correo,
            first_name: data.nombre,
            last_name: data.apellido,
            phone: data.telefono,
            id_role: 3, // Role 3 is Patient
        });
    }
}
