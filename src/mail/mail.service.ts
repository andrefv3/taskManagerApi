import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOTP(email: string, code: string) {
    try {
      await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'Kynetic <onboarding@resend.dev>',
        to: email,
        subject: `${code} es tu código de verificación`,
        html: `
          <div style="font-family: sans-serif; max-width: 400px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
            <h2 style="color: #111;">Verifica tu cuenta</h2>
            <p>Usa este código para activar tu cuenta en <b>Kynetic</b>:</p>
            <div style="background: #f4f4f7; padding: 15px; text-align: center; border-radius: 8px; font-size: 30px; font-weight: bold; letter-spacing: 10px;">
              ${code}
            </div>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">Expira en 10 minutos.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Resend Error:', error);
    }
  }
}