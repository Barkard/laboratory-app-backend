import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomFilesService {
    constructor(private prisma: PrismaService) { }

    create(data: { config_name: string; json_schema: string }) {
        return this.prisma.customFiles.create({ data });
    }

    findAll() {
        return this.prisma.customFiles.findMany();
    }

    findOne(id: number) {
        return this.prisma.customFiles.findUnique({
            where: { id_file: id },
        });
    }

    update(id: number, data: { config_name?: string; json_schema?: string }) {
        return this.prisma.customFiles.update({
            where: { id_file: id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.customFiles.delete({
            where: { id_file: id },
        });
    }
}
