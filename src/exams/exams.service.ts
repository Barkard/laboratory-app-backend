import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamsService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        id_type?: number;
        id_file?: number;
        // Specialized creation data
        exam_type_data?: { category_name: string; detail: string };
        custom_file_data?: { config_name: string; json_schema: string };
    }) {
        return this.prisma.$transaction(async (tx) => {
            let typeId = data.id_type;
            let fileId = data.id_file;

            if (data.custom_file_data) {
                const file = await tx.customFiles.create({
                    data: data.custom_file_data,
                });
                fileId = file.id_file;
            }

            if (data.exam_type_data) {
                const type = await tx.examType.create({
                    data: data.exam_type_data,
                });
                typeId = type.id_type;
            }

            if (!typeId || !fileId) {
                throw new Error('id_type and id_file are required to create an Exam');
            }

            return tx.exam.create({
                data: {
                    id_type: typeId,
                    id_file: fileId,
                },
                include: {
                    exam_type: true,
                    custom_files: true,
                },
            });
        });
    }

    findAll() {
        return this.prisma.exam.findMany({
            include: {
                exam_type: true,
                custom_files: true,
            },
        });
    }

    findOne(id: number) {
        return this.prisma.exam.findUnique({
            where: { id_exam: id },
            include: {
                exam_type: true,
                custom_files: true,
            },
        });
    }

    update(id: number, data: { id_type?: number; id_file?: number }) {
        return this.prisma.exam.update({
            where: { id_exam: id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.exam.delete({
            where: { id_exam: id },
        });
    }
}
