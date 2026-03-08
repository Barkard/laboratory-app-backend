import { Module } from '@nestjs/common';
import { ExamTypeService } from './exam-type.service';
import { ExamTypeController } from './exam-type.controller';

@Module({
    controllers: [ExamTypeController],
    providers: [ExamTypeService],
})
export class ExamTypeModule { }
