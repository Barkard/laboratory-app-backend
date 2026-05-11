import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendMail(to: string, subject: string, text: string, html?: string, attachments?: any[]) {
    try {
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (!apiKey) {
            console.warn('Resend API Key missing. Skipping email send.');
            return;
        }
        
        const { data, error } = await this.resend.emails.send({
            from: 'Laboratorio Clínico <onboarding@resend.dev>',
            to,
            subject,
            text,
            html: html || text,
            attachments: attachments || [],
        });

        if (error) {
            console.error('Error sending email via Resend:', error);
            return;
        }

        console.log(`Email sent successfully via Resend: ${data?.id}`);
    } catch (error) {
        console.error('Unexpected error sending email:', error);
    }
  }
}

