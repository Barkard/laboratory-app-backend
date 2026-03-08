import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamTypeService {
    constructor(private prisma: PrismaService) { }

    create(data: { category_name: string; detail: string; requirements?: string }) {
        return this.prisma.examType.create({ data });
    }

    findAll() {
        return this.prisma.examType.findMany();
    }

    findOne(id: number) {
        return this.prisma.examType.findUnique({
            where: { id_type: id },
        });
    }

    update(id: number, data: { category_name?: string; detail?: string; requirements?: string }) {
        return this.prisma.examType.update({
            where: { id_type: id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.examType.delete({
            where: { id_type: id },
        });
    }
}
