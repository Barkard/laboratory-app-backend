import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    id_type?: number;
    id_file?: number;
    // Specialized creation data
    exam_type_data?: { category_name: string; detail: string };
    custom_file_data?: { config_name: string; json_schema: string };
  }) {
    return this.prisma.$transaction(async (tx) => {
      let typeId = data.id_type;
      let fileId = data.id_file;

      if (data.custom_file_data) {
        const file = await tx.customFiles.create({
          data: data.custom_file_data,
        });
        fileId = file.id_file;
      }

      if (data.exam_type_data) {
        const type = await tx.examType.create({
          data: data.exam_type_data,
        });
        typeId = type.id_type;
      }

      if (!typeId || !fileId) {
        throw new Error('id_type and id_file are required to create an Exam');
      }

      return tx.exam.create({
        data: {
          id_type: typeId,
          id_file: fileId,
        },
        include: {
          exam_type: true,
          custom_files: true,
        },
      });
    });
  }

  findAll() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      include: {
        exam_type: {
          include: {
            class_exam: true,
          },
        },
        custom_files: true,
      },
    };
    return this.prisma.exam.findMany(query);
  }

  findOne(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      where: { id_exam: id },
      include: {
        exam_type: {
          include: {
            class_exam: true,
          },
        },
        custom_files: true,
      },
    };
    return this.prisma.exam.findUnique(query);
  }

  async update(id: number, data: {
    id_type?: number;
    id_file?: number;
    exam_type_data?: { category_name: string; detail: string };
    custom_file_data?: { config_name: string; json_schema: string };
  }) {
    return this.prisma.$transaction(async (tx) => {
      // Update custom file (template) if supplied
      if (data.custom_file_data) {
        const exam = await tx.exam.findUnique({ where: { id_exam: id } });
        if (exam) {
          await tx.customFiles.update({
            where: { id_file: exam.id_file },
            data: data.custom_file_data,
          });
        }
      }

      // Update exam type if supplied
      if (data.exam_type_data) {
        const exam = await tx.exam.findUnique({ where: { id_exam: id } });
        if (exam) {
          await tx.examType.update({
            where: { id_type: exam.id_type },
            data: data.exam_type_data,
          });
        }
      }

      // Prepare connections for id_type / id_file if they are passed directly
      const updateData: any = {};
      if (data.id_type) updateData.exam_type = { connect: { id_type: data.id_type } };
      if (data.id_file) updateData.custom_files = { connect: { id_file: data.id_file } };

      if (Object.keys(updateData).length > 0) {
        return tx.exam.update({
          where: { id_exam: id },
          data: updateData,
          include: { exam_type: true, custom_files: true },
        });
      }

      // No direct changes, just return the current exam with relations
      return tx.exam.findUnique({
        where: { id_exam: id },
        include: { exam_type: true, custom_files: true },
      });
    });
  }

  remove(id: number) {
    return this.prisma.exam.delete({
      where: { id_exam: id },
    });
  }
}
