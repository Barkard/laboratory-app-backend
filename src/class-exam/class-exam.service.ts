import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassExamService {
  constructor(private prisma: PrismaService) {}

  create(data: { class_name: string }) {
    return (this.prisma as any).classExam.create({ data });
  }

  findAll() {
    return (this.prisma as any).classExam.findMany({
      include: {
        exam_types: true,
      },
    });
  }

  findOne(id: number) {
    return (this.prisma as any).classExam.findUnique({
      where: { id_class: id },
      include: {
        exam_types: true,
      },
    });
  }

  update(id: number, data: { class_name: string }) {
    return (this.prisma as any).classExam.update({
      where: { id_class: id },
      data,
    });
  }

  remove(id: number) {
    return (this.prisma as any).classExam.delete({
      where: { id_class: id },
    });
  }
}
