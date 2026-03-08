import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamAppointmentDetailsService {
    constructor(private prisma: PrismaService) { }

    create(data: { id_appointment: number; id_exam: number; patient_observations?: string }) {
        return this.prisma.examAppointmentDetail.create({ data });
    }

    findAll() {
        return this.prisma.examAppointmentDetail.findMany({
            include: {
                appointment: true,
                exam: {
                    include: {
                        exam_type: true,
                    },
                },
                result: true,
            },
        });
    }

    findOne(id: number) {
        return this.prisma.examAppointmentDetail.findUnique({
            where: { id_detail: id },
            include: {
                appointment: true,
                exam: {
                    include: {
                        exam_type: true,
                    },
                },
                result: true,
            },
        });
    }

    update(id: number, data: { patient_observations?: string }) {
        return this.prisma.examAppointmentDetail.update({
            where: { id_detail: id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.examAppointmentDetail.delete({
            where: { id_detail: id },
        });
    }
}
