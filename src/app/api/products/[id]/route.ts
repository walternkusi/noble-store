import { NextRequest, NextResponse } from 'next/server';
import { getDb, productsCol } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { uploadImages } from '@/lib/cloudinary';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getDb();
    const { id } = await params;
    const product = await productsCol().findOne({ id });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
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

    const body = await request.json();
    const { name, category, price, description, images, sizes, colors, stock, featured, newArrival } = body;

    let processedImages = images;
    if (images !== undefined && Array.isArray(images)) {
      const base64Images = images.filter((img: string) => img.startsWith('data:'));
      const urlImages = images.filter((img: string) => !img.startsWith('data:'));
      if (base64Images.length > 0) {
        const uploaded = await uploadImages(base64Images);
        processedImages = [...urlImages, ...uploaded];
      }
    }

    const update: any = { updatedAt: new Date() };
    if (name !== undefined) update.name = name;
    if (category !== undefined) update.category = category;
    if (price !== undefined) update.price = parseFloat(price);
    if (description !== undefined) update.description = description;
    if (images !== undefined) update.images = processedImages;
    if (sizes !== undefined) update.sizes = sizes;
    if (colors !== undefined) update.colors = colors;
    if (stock !== undefined) update.stock = stock;
    if (featured !== undefined) update.featured = Boolean(featured);
    if (newArrival !== undefined) update.newArrival = Boolean(newArrival);

    await productsCol().updateOne({ id }, { $set: update });

    const updated = await productsCol().findOne({ id });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
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

    await productsCol().deleteOne({ id });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
