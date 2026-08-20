import { NextRequest, NextResponse } from 'next/server';
import { getDb, adminsCol } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'girls-fashion-shop-secret-key-2024';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await getDb();
    const admin = await adminsCol().findOne({ email });

    if (!admin) {
      return NextResponse.json({ error: 'If this email exists, a reset link has been sent.' });
    }

    const resetToken = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '1h' });

    await adminsCol().updateOne(
      { id: admin.id },
      { $set: { resetToken, resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) } }
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/admin/reset-password?token=${resetToken}`;

    console.log('\n=================================');
    console.log('PASSWORD RESET LINK (dev mode):');
    console.log(resetUrl);
    console.log('=================================\n');

    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch (emailError) {
      console.log('Email send failed (SMTP not configured), link logged above.');
    }

    return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
