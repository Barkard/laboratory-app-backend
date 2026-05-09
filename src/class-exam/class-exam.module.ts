import { Module } from '@nestjs/common';
import { ClassExamService } from './class-exam.service';
import { ClassExamController } from './class-exam.controller';

@Module({
  controllers: [ClassExamController],
  providers: [ClassExamService],
})
export class ClassExamModule {}
