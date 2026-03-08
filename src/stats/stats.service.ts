import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const allAppointments = await this.prisma.appointment.findMany({
            include: {
                user: true,
                exam_appointment_detail: {
                    include: {
                        exam: {
                            include: {
                                exam_type: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                requested_date: 'desc'
            }
        });

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

        const totalAppointments = allAppointments.filter(app => {
            const appDate = new Date(app.requested_date);
            return appDate >= startOfToday && appDate <= endOfToday;
        }).length;

        const pendingResults = allAppointments.filter(app => app.status === 'AGENDADA').length;
        const pendingAppointments = allAppointments
            .filter(app => app.status === 'PENDIENTE')
            .slice(0, 5);

        const [totalUsers, examsPerformed] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.exam.count()
        ]);

        return {
            totalUsers,
            totalAppointments, // Citas para hoy
            pendingResults,    // Citas agendadas
            examsPerformed,
            pendingAppointments
        };
    }
}
