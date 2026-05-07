import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  static async sendVerificationCode(email: string, code: string) {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Kynetic <onboarding@resend.dev>',
      to: [email],
      subject: `${code} es tu código de confirmación`,
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 12px;">
          <h2 style="color: #111; text-align: center;">Verifica tu cuenta</h2>
          <p style="color: #555; text-align: center;">Copia y pega el siguiente código para completar tu registro en <b>Kynetic</b>.</p>
          <div style="background: #f4f4f7; color: #111; padding: 20px; text-align: center; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #999; text-align: center;">
            Este código expirará en 10 minutos. Si no solicitaste esto, ignora el correo.
          </p>
        </div>
      `,
    });

    if (error) throw new Error(error.message);
    return data;
  }
}