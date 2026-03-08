import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
    constructor(private readonly examsService: ExamsService) { }

    @Post()
    create(@Body() createExamDto: {
        id_type?: number;
        id_file?: number;
        exam_type_data?: { category_name: string; detail: string };
        custom_file_data?: { config_name: string; json_schema: string };
    }) {
        return this.examsService.create(createExamDto);
    }

    @Get()
    findAll() {
        return this.examsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.examsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateExamDto: { id_type?: number; id_file?: number }) {
        return this.examsService.update(id, updateExamDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.examsService.remove(id);
    }
}
