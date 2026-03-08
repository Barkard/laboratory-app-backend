import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ExamTypeService } from './exam-type.service';

@Controller('exams/types')
export class ExamTypeController {
    constructor(private readonly examTypeService: ExamTypeService) { }

    @Post()
    create(@Body() createExamTypeDto: { category_name: string; detail: string; requirements?: string }) {
        return this.examTypeService.create(createExamTypeDto);
    }

    @Get()
    findAll() {
        return this.examTypeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.examTypeService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateExamTypeDto: { category_name?: string; detail?: string; requirements?: string }) {
        return this.examTypeService.update(id, updateExamTypeDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.examTypeService.remove(id);
    }
}
