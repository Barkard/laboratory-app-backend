import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    create(data: { name: string }) {
        return this.prisma.role.create({ data });
    }

    findAll() {
        return this.prisma.role.findMany();
    }

    findOne(id: number) {
        return this.prisma.role.findUnique({
            where: { id_role: id },
        });
    }

    update(id: number, data: { name?: string }) {
        return this.prisma.role.update({
            where: { id_role: id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.role.delete({
            where: { id_role: id },
        });
    }
}
