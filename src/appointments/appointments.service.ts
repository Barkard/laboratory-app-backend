import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { id_user: number; requested_date: string | Date; status: string; exam_ids?: number[]; observations?: string }) {
        const { exam_ids, observations, ...appointmentData } = data;

        return this.prisma.$transaction(async (tx) => {
            const appointment = await tx.appointment.create({
                data: {
                    ...appointmentData,
                    requested_date: new Date(appointmentData.requested_date),
                },
            });

            if (exam_ids && exam_ids.length > 0) {
                await tx.examAppointmentDetail.createMany({
                    data: exam_ids.map((examId) => ({
                        id_appointment: appointment.id_appointment,
                        id_exam: examId,
                        patient_observations: observations || null,
                    })),
                });
            }

            return tx.appointment.findUnique({
                where: { id_appointment: appointment.id_appointment },
                include: {
                    user: true,
                    exam_appointment_detail: {
                        include: { exam: true },
                    },
                },
            });
        });
    }

    findAll() {
        return this.prisma.appointment.findMany({
            include: {
                user: true,
                exam_appointment_detail: {
                    include: {
                        exam: {
                            include: {
                                exam_type: true,
                                custom_files: true,
                            }
                        },
                    },
                },
            },
        });
    }

    findOne(id: number) {
        return this.prisma.appointment.findUnique({
            where: { id_appointment: id },
            include: {
                user: true,
                exam_appointment_detail: {
                    include: {
                        exam: {
                            include: {
                                exam_type: true,
                                custom_files: true,
                            }
                        },
                    },
                },
            },
        });
    }

    update(id: number, data: { requested_date?: string | Date; status?: string }) {
        return this.prisma.appointment.update({
            where: { id_appointment: id },
            data: {
                ...data,
                requested_date: data.requested_date ? new Date(data.requested_date) : undefined,
            },
        });
    }

    async remove(id: number) {
        console.log(`Eliminando cita con ID: ${id}`);
        try {
            return await this.prisma.$transaction(async (tx) => {
                // 1. Get all detail IDs for this appointment
                const details = await tx.examAppointmentDetail.findMany({
                    where: { id_appointment: id },
                    select: { id_detail: true }
                });

                const detailIds = details.map(d => d.id_detail);
                console.log(`Detalles encontrados: ${detailIds.join(', ')}`);

                // 2. Delete all results associated with these details
                if (detailIds.length > 0) {
                    const deleteResults = await tx.result.deleteMany({
                        where: {
                            id_appointment_detail: {
                                in: detailIds
                            }
                        }
                    });
                    console.log(`Resultados eliminados: ${deleteResults.count}`);
                }

                // 3. Delete all exam details for this appointment
                const deleteDetails = await tx.examAppointmentDetail.deleteMany({
                    where: {
                        id_appointment: id
                    }
                });
                console.log(`Detalles de cita eliminados: ${deleteDetails.count}`);

                // 4. Delete the appointment itself
                const deleteAppointment = await tx.appointment.delete({
                    where: { id_appointment: id },
                });
                console.log(`Cita eliminada correctamente`);
                return deleteAppointment;
            });
        } catch (error) {
            console.error('Error en remove(id):', error);
            throw error;
        }
    }
}
