import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ClassExamService } from './class-exam.service';

@Controller('class-exam')
export class ClassExamController {
  constructor(private readonly classExamService: ClassExamService) {}

  @Post()
  create(@Body() data: { class_name: string }) {
    return this.classExamService.create(data);
  }

  @Get()
  findAll() {
    return this.classExamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classExamService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { class_name: string },
  ) {
    return this.classExamService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.classExamService.remove(id);
  }
}
