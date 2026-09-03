import { MongoClient, Db, Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'girlsfashion';

let clientPromise: Promise<MongoClient> | null = null;
let db: Db | null = null;

async function connect(): Promise<Db> {
  if (db) return db;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  if (!clientPromise) {
    const client = new MongoClient(MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
    });
    clientPromise = client.connect();
  }

  const client = await clientPromise;
  db = client.db(DB_NAME);

  const adminCount = await db.collection('admins').countDocuments();
  if (adminCount === 0) {
    const hashedPassword = bcrypt.hashSync('walter12!', 10);
    await db.collection('admins').insertOne({
      id: randomUUID(),
      name: 'Admin',
      email: 'walter@gmail.com',
      password: hashedPassword,
      role: 'superadmin',
      createdAt: new Date(),
    });
  }

  return db;
}

export async function getDb(): Promise<Db> {
  return connect();
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
