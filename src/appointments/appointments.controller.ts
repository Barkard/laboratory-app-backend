import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    create(@Body() createAppointmentDto: {
        id_user: number;
        requested_date: string;
        status: string;
        exam_ids?: number[];
        observations?: string;
    }) {
        return this.appointmentsService.create(createAppointmentDto);
    }

    @Get()
    findAll() {
        return this.appointmentsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.appointmentsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateAppointmentDto: { requested_date?: string; status?: string }) {
        return this.appointmentsService.update(id, updateAppointmentDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.appointmentsService.remove(id);
    }
}
