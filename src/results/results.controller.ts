import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
    constructor(private readonly resultsService: ResultsService) { }

    @Post()
    async create(@Body() data: { id_appointment_detail: number; delivery_date: string; result_data?: string }) {
        try {
            return await this.resultsService.create(data);
        } catch (error: any) {
            console.error("Error in ResultsController.create:", error);
            throw new HttpException(error.message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    findAll() {
        return this.resultsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.resultsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: { delivery_date?: string }) {
        return this.resultsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.resultsService.remove(id);
    }
}
