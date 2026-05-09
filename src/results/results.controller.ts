import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  async create(
    @Body()
    data: {
      id_appointment_detail: number;
      delivery_date: string;
      result_data?: string;
    },
  ) {
    try {
      return await this.resultsService.create(data);
    } catch (error) {
      console.error('Error in ResultsController.create:', error);
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll(): Promise<any[]> {
    return this.resultsService.findAll() as unknown as Promise<any[]>;
  }

  @Get('pdf/:id')
  async generatePDF(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const buffer = await this.resultsService.generatePDF(id);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=resultado_${id}.pdf`,
        'Content-Length': buffer.length,
      });
      res.end(buffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      const message =
        error instanceof Error ? error.message : 'Error generating PDF';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { delivery_date?: string },
  ) {
    return this.resultsService.update(id, data);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.resultsService.findOne(id) as unknown as Promise<any>;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.resultsService.remove(id);
  }
}
