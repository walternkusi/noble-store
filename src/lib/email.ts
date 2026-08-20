import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await transporter.sendMail({
    from: `"Noble Store" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset Your Admin Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p style="color: #555; line-height: 1.6;">
          You requested a password reset for your Noble Store admin account.
        </p>
        <p style="color: #555; line-height: 1.6;">
          Click the button below to set a new password. This link will expire in 1 hour.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #db2777; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
}
