import { NextRequest, NextResponse } from 'next/server';
import { getDb, adminsCol } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await getDb();

    const admin = await adminsCol().findOne(
      { id: decoded.id },
      { projection: { password: 0 } }
    );

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error('Error fetching admin info:', error);
    return NextResponse.json({ error: 'Failed to fetch admin info' }, { status: 500 });
  }
}
