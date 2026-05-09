import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    id_appointment_detail: number;
    delivery_date: string | Date;
    result_data?: string;
  }) {
    const date = new Date(data.delivery_date);
    const finalDate = isNaN(date.getTime()) ? new Date() : date;

    return this.prisma.result.create({
      data: {
        ...data,
        delivery_date: finalDate,
      },
    });
  }

  findAll() {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
    const query: any = {
      include: {
        exam_appointment_detail: {
          include: {
            exam: {
              include: {
                exam_type: {
                  include: {
                    class_exam: true,
                  },
                },
                custom_files: true,
              },
            },
            appointment: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    };
    return (this.prisma.result as any).findMany(query);
  }

  findOne(id: number) {
    const query: any = {
      where: { id_result: id },
      include: {
        exam_appointment_detail: {
          include: {
            exam: {
              include: {
                exam_type: {
                  include: {
                    class_exam: true,
                  },
                },
                custom_files: true,
              },
            },
            appointment: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    };
    return (this.prisma.result as any).findUnique(query);
  }

  update(id: number, data: { delivery_date?: string | Date }) {
    let finalDate: Date | undefined = undefined;
    if (data.delivery_date) {
      const date = new Date(data.delivery_date);
      finalDate = isNaN(date.getTime()) ? undefined : date;
    }

    return this.prisma.result.update({
      where: { id_result: id },
      data: {
        ...data,
        delivery_date: finalDate,
      },
    });
  }

  async generatePDF(id: number): Promise<Buffer> {
    const result: any = await this.findOne(id);
    if (!result) throw new NotFoundException('Resultado no encontrado');

    const detail = result['exam_appointment_detail'];
    const exam = detail?.['exam'];
    const appointment = detail?.['appointment'];
    const patient = appointment?.['user'];
    const examType = exam?.['exam_type'];
    const examName = (examType?.['category_name'] as string) || 'Examen';
    const classExam = examType?.['class_exam'];
    const className = (classExam?.['class_name'] as string) || 'Sin clase';

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header - Laboratory Logo/Name
      doc
        .fillColor('#0ea5e9')
        .fontSize(20)
        .text('SERVICIO DE LABORATORIO', { align: 'center' })
        .text('HOSPITAL DR. CARLOS ROA', { align: 'center' })
        .text('MORENO LA GRITA', { align: 'center' });
      doc.moveDown(0.2);
      doc
        .fillColor('#64748b')
        .fontSize(10)
        .text('Tu salud, nuestra prioridad', { align: 'center' });
      doc.moveDown(1.5);

      // Report Title
      doc
        .fillColor('#1e293b')
        .fontSize(16)
        .text('REPORTE DE RESULTADOS', { align: 'left' });
      doc.rect(50, doc.y, 500, 2).fill('#38bdf8');
      doc.moveDown(1);

      // Patient Information Section
      doc
        .fillColor('#0ea5e9')
        .fontSize(12)
        .text('INFORMACIÓN DEL PACIENTE', { characterSpacing: 1 });
      doc.moveDown(0.5);
      doc.fillColor('#1e293b').fontSize(10);

      const infoY = doc.y;
      const patientName = `${patient?.['first_name'] as string} ${patient?.['last_name'] as string}`;
      doc
        .font('Helvetica-Bold')
        .text('Nombre: ', { continued: true })
        .font('Helvetica')
        .text(patientName);
      doc
        .font('Helvetica-Bold')
        .text('Cédula: ', { continued: true })
        .font('Helvetica')
        .text(patient?.['uid'] as string);
      doc
        .font('Helvetica-Bold')
        .text('Nro. Resultado: ', { continued: true })
        .font('Helvetica')
        .text(result['id_result'] as string);

      doc.y = infoY;
      const deliveryDate = new Date(
        result['delivery_date'] as string,
      ).toLocaleDateString();
      doc.text(`Fecha Entrega: ${deliveryDate}`, { align: 'right' });
      doc.text(`Clase: ${className}`, { align: 'right' });
      doc.text(`Examen: ${examName}`, { align: 'right' });
      doc.moveDown(2);

      // Results Table/Content
      doc
        .fillColor('#0ea5e9')
        .fontSize(12)
        .text('VALORES OBTENIDOS', { characterSpacing: 1 });
      doc.moveDown(1);

      doc.rect(50, doc.y, 500, 20).fill('#f1f5f9');
      doc
        .fillColor('#475569')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('PARÁMETRO', 60, doc.y - 15);
      doc.text('RESULTADO', 350, doc.y - 15);
      doc.font('Helvetica');
      doc.moveDown(0.5);

      // Parse Results
      if (result['result_data']) {
        try {
          const data = JSON.parse(result['result_data'] as string) as Record<
            string,
            unknown
          >;
          const customFiles = exam?.['custom_files'];
          const schemaStr = customFiles?.['json_schema'] as string;
          const schema = schemaStr
            ? (JSON.parse(schemaStr) as Array<{ id: string; label: string }>)
            : [];

          const legacyMapping: Record<string, string> = {
            bza1hjqz6: 'Color',
            aspecto_id: 'Aspecto',
          };

          Object.entries(data).forEach(([key, value]) => {
            const fieldDef = schema.find((f: { id: string }) => f.id === key);
            const label: string = fieldDef
              ? fieldDef.label
              : legacyMapping[key] || key;

            let displayValue = String(value);
            if (typeof value === 'boolean')
              displayValue = value ? 'Positivo' : 'Negativo';

            doc.fillColor('#1e293b').fontSize(10).text(label, 60);
            doc
              .fillColor('#1e293b')
              .fontSize(10)
              .text(displayValue, 350, doc.y - 12);
            doc.moveDown(0.5);
            doc
              .moveTo(50, doc.y)
              .lineTo(550, doc.y)
              .strokeColor('#e2e8f0')
              .stroke();
            doc.moveDown(0.5);
          });
        } catch {
          doc.text('Error al procesar los datos del resultado.');
        }
      } else {
        doc.text('No hay datos registrados para este examen.');
      }

      doc.end();
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
  }

  remove(id: number) {
    return this.prisma.result.delete({
      where: { id_result: id },
    });
  }
}
