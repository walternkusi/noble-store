import { NextRequest, NextResponse } from 'next/server';
import { getDb, productsCol } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { randomUUID } from 'crypto';
import { uploadImages } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    await getDb();
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured');
    const newArrival = searchParams.get('newArrival');

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (size) {
      filter.sizes = size;
    }

    if (color) {
      filter.colors = color;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (newArrival === 'true') {
      filter.newArrival = true;
    }

    let sortOption: any = { createdAt: -1 };
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'popular':
        sortOption = { stock: -1 };
        break;
    }

    const products = await productsCol().find(filter).sort(sortOption).toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await getDb();

    const body = await request.json();
    const { name, category, price, description, images, sizes, colors, stock, featured, newArrival } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json({ error: 'Name, category, and price are required' }, { status: 400 });
    }

    let imageUrls: string[] = [];
    const base64Images = images?.filter((img: string) => img.startsWith('data:')) || [];
    const urlImages = images?.filter((img: string) => !img.startsWith('data:')) || [];

    if (base64Images.length > 0) {
      try {
        imageUrls = [...urlImages, ...await uploadImages(base64Images)];
      } catch (uploadError) {
        console.error('Error uploading images:', uploadError);
        return NextResponse.json(
          { error: `Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    } else {
      imageUrls = urlImages;
    }

    const product = {
      id: randomUUID(),
      name,
      category,
      price: parseFloat(price),
      description: description || '',
      images: imageUrls,
      sizes: sizes || [],
      colors: colors || [],
      stock: stock || 0,
      featured: Boolean(featured),
      newArrival: Boolean(newArrival),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await productsCol().insertOne(product);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
