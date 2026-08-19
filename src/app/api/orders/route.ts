import { NextRequest, NextResponse } from 'next/server';
import { getDb, ordersCol } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await getDb();

    const orders = await ordersCol().find().sort({ createdAt: -1 }).toArray();

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await getDb();
    const body = await request.json();

    const customer = body.customer || {};
    const customerName = body.customerName || customer.fullName || '';
    const phone = body.phone || customer.phone || '';
    const email = body.email || customer.email || '';
    const address = body.address || customer.address || '';
    const city = body.city || customer.city || '';

    const deliveryMethod = body.deliveryMethod || 'delivery';
    const notes = body.notes || '';
    const subtotal = body.subtotal || 0;
    const deliveryFee = body.deliveryFee || 0;
    const total = body.total || 0;

    let products: string[] = [];
    let quantities: (string | number)[] = [];
    let sizes: string[] = [];
    let colors: string[] = [];

    if (body.items && Array.isArray(body.items) && body.items.length > 0) {
      products = body.items.map((item: any) => item.name || item.id || '');
      quantities = body.items.map((item: any) => item.quantity || 1);
      sizes = body.items.map((item: any) => item.size || '');
      colors = body.items.map((item: any) => item.color || '');
    } else if (body.products && Array.isArray(body.products)) {
      products = body.products;
      quantities = body.quantities || [];
      sizes = body.sizes || [];
      colors = body.colors || [];
    }

    if (!customerName || !phone || !address) {
      return NextResponse.json({ error: 'Customer name, phone, and address are required' }, { status: 400 });
    }

    if (products.length === 0) {
      return NextResponse.json({ error: 'At least one product is required' }, { status: 400 });
    }

    const order = {
      id: randomUUID(),
      customerName,
      phone,
      email,
      address,
      city,
      deliveryMethod,
      notes,
      products,
      quantities,
      sizes,
      colors,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ordersCol().insertOne(order);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
