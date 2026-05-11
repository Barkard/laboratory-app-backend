import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MailService } from '../src/mail/mail.service';

async function testEmail() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const mailService = app.get(MailService);

  console.log('--- Iniciando prueba de Resend ---');
  
  // RECUERDA: En el plan gratuito de Resend, 'to' debe ser tu propio correo
  const to = 'juniorpinedafigueroa@gmail.com'; 
  const subject = 'Prueba de Resend - Sistema de Laboratorio';
  const text = '¡Hola! Si recibes este correo, Resend está configurado correctamente en el backend.';
  const html = '<h1>¡Éxito!</h1><p>Resend está funcionando correctamente en el sistema de laboratorio.</p>';

  await mailService.sendMail(to, subject, text, html);
  
  console.log('--- Prueba finalizada. Revisa tu bandeja de entrada (y SPAM) ---');
  await app.close();
}

testEmail();
