import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        uid: string;
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        id_role?: number;
    }) {
        return this.prisma.user.create({
            data: {
                ...data,
                email: data.email.toLowerCase(),
            },
        });
    }


    findAll() {
        return this.prisma.user.findMany({
            include: {
                role: true,
            },
        });
    }

    findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id_user: id },
            include: {
                role: true,
                appointments: true,
            },
        });
    }

    findByUid(uid: string) {
        return this.prisma.user.findUnique({
            where: { uid },
            include: {
                role: true,
            },
        });
    }

    findByEmail(email: string) {

        return this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                role: true,
            },
        });
    }


    findByPhone(phone: string) {
        return this.prisma.user.findFirst({
            where: { phone },
            include: {
                role: true,
            },
        });
    }



    update(id: number, data: {
        email?: string;
        first_name?: string;
        last_name?: string;
        phone?: string;
        id_role?: number;
    }) {
        return this.prisma.user.update({
            where: { id_user: id },
            data: {
                ...data,
                email: data.email ? data.email.toLowerCase() : undefined,
            },
        });
    }


    remove(id: number) {
        return this.prisma.user.delete({
            where: { id_user: id },
        });
    }
}
