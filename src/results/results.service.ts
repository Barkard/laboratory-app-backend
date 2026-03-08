import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultsService {
    constructor(private prisma: PrismaService) { }

    create(data: { id_appointment_detail: number; delivery_date: string | Date; result_data?: string }) {
        return this.prisma.result.create({
            data: {
                ...data,
                delivery_date: new Date(data.delivery_date),
            },
        });
    }

    findAll() {
        return this.prisma.result.findMany({
            include: {
                exam_appointment_detail: {
                    include: {
                        exam: {
                            include: {
                                exam_type: true,
                            },
                        },
                        appointment: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });
    }

    findOne(id: number) {
        return this.prisma.result.findUnique({
            where: { id_result: id },
            include: {
                exam_appointment_detail: {
                    include: {
                        exam: {
                            include: {
                                exam_type: true,
                            },
                        },
                        appointment: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });
    }

    update(id: number, data: { delivery_date?: string | Date }) {
        return this.prisma.result.update({
            where: { id_result: id },
            data: {
                ...data,
                delivery_date: data.delivery_date ? new Date(data.delivery_date) : undefined,
            },
        });
    }

    remove(id: number) {
        return this.prisma.result.delete({
            where: { id_result: id },
        });
    }
}
