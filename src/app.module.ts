import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

import { RolesModule } from './roles/roles.module';
import { ExamTypeModule } from './exam-type/exam-type.module';
import { CustomFilesModule } from './custom-files/custom-files.module';
import { ExamsModule } from './exams/exams.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ExamAppointmentDetailsModule } from './exam-appointment-details/exam-appointment-details.module';
import { ResultsModule } from './results/results.module';
import { AuthModule } from './auth/auth.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    RolesModule,
    ExamTypeModule,
    CustomFilesModule,
    ExamsModule,
    AppointmentsModule,
    ExamAppointmentDetailsModule,
    ResultsModule,
    AuthModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
