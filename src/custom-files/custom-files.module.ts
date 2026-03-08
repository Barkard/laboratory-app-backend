import { Module } from '@nestjs/common';
import { CustomFilesService } from './custom-files.service';
import { CustomFilesController } from './custom-files.controller';

@Module({
    controllers: [CustomFilesController],
    providers: [CustomFilesService],
})
export class CustomFilesModule { }
