import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ExamAppointmentDetailsService } from './exam-appointment-details.service';

@Controller('exam-appointment-details')
export class ExamAppointmentDetailsController {
    constructor(private readonly detailsService: ExamAppointmentDetailsService) { }

    @Post()
    create(@Body() data: { id_appointment: number; id_exam: number; patient_observations?: string }) {
        return this.detailsService.create(data);
    }

    @Get()
    findAll() {
        return this.detailsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.detailsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: { patient_observations?: string }) {
        return this.detailsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.detailsService.remove(id);
    }
}
