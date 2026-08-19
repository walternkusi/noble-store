import { NextRequest, NextResponse } from 'next/server';
import { getDb, productsCol } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await getDb();
    const { id } = await params;

    const existing = await productsCol().findOne({ id });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    const currentImages: string[] = existing.images || [];

    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        const url = await uploadImage(dataUrl);
        currentImages.push(url);
      }
    }

    await productsCol().updateOne(
      { id },
      { $set: { images: currentImages, updatedAt: new Date() } }
    );

    const updated = await productsCol().findOne({ id });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
  }
}
