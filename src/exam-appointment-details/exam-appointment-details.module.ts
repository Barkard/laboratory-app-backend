import { Module } from '@nestjs/common';
import { ExamAppointmentDetailsService } from './exam-appointment-details.service';
import { ExamAppointmentDetailsController } from './exam-appointment-details.controller';

@Module({
    controllers: [ExamAppointmentDetailsController],
    providers: [ExamAppointmentDetailsService],
})
export class ExamAppointmentDetailsModule { }
