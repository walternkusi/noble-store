import { MongoClient, Db, Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'girlsfashion';

let client: MongoClient | null = null;
let db: Db | null = null;
let initialized = false;

export async function getDb(): Promise<Db> {
  if (db) return db;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);

  if (!initialized) {
    initialized = true;

    const adminCount = await db.collection('admins').countDocuments();
    if (adminCount === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await db.collection('admins').insertOne({
        id: randomUUID(),
        name: 'Admin',
        email: 'admin@girlsfashion.com',
        password: hashedPassword,
        role: 'superadmin',
        createdAt: new Date(),
      });
    }
  }

  return db;
}

export function productsCol(): Collection {
  return db!.collection('products');
}

export function ordersCol(): Collection {
  return db!.collection('orders');
}

export function adminsCol(): Collection {
  return db!.collection('admins');
}
