import { NextRequest, NextResponse } from 'next/server';
import { getDb, adminsCol } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'girls-fashion-shop-secret-key-2024';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    await getDb();
    const admin = await adminsCol().findOne({ id: payload.id });

    if (!admin || admin.resetToken !== token) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    const hashedPassword = hashPassword(password);

    await adminsCol().updateOne(
      { id: payload.id },
      { $set: { password: hashedPassword }, $unset: { resetToken: '', resetTokenExpiry: '' } }
    );

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
