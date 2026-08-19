import { NextRequest, NextResponse } from 'next/server';
import { getDb, productsCol, ordersCol } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await getDb();

    const totalProducts = await productsCol().countDocuments();
    const totalOrders = await ordersCol().countDocuments();
    const pendingOrders = await ordersCol().countDocuments({ status: 'pending' });
    const completedOrders = await ordersCol().countDocuments({ status: 'delivered' });

    const salesResult = await ordersCol().aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]).toArray();
    const totalSales = salesResult[0]?.total ?? 0;

    const recentOrders = await ordersCol().find().sort({ createdAt: -1 }).limit(5).toArray();
    const recentProducts = await productsCol().find().sort({ createdAt: -1 }).limit(5).toArray();

    return NextResponse.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSales,
      recentOrders,
      recentProducts,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
