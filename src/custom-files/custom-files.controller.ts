import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CustomFilesService } from './custom-files.service';

@Controller('custom-files')
export class CustomFilesController {
    constructor(private readonly customFilesService: CustomFilesService) { }

    @Post()
    create(@Body() createCustomFileDto: { config_name: string; json_schema: string }) {
        return this.customFilesService.create(createCustomFileDto);
    }

    @Get()
    findAll() {
        return this.customFilesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.customFilesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateCustomFileDto: { config_name?: string; json_schema?: string }) {
        return this.customFilesService.update(id, updateCustomFileDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.customFilesService.remove(id);
    }
}
