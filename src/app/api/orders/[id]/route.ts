import { NextRequest, NextResponse } from 'next/server';
import { getDb, ordersCol } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(
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
    const order = await ordersCol().findOne({ id });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const products: any[] = order.products || [];
    const quantities: any[] = order.quantities || [];
    const sizes: any[] = order.sizes || [];
    const colors: any[] = order.colors || [];

    const items = products.map((product: any, i: number) => {
      if (typeof product === 'object' && product !== null) {
        return product;
      }
      return {
        productName: typeof product === 'string' ? product : String(product),
        quantity: quantities[i] ?? 1,
        size: sizes[i] ?? '',
        color: colors[i] ?? '',
        price: 0,
      };
    });

    return NextResponse.json({
      ...order,
      products,
      quantities,
      sizes,
      colors,
      items,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
