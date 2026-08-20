import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://umusarerw_db_user:ge1u3yCJBYHmsizg@cluster0.sj6ryjb.mongodb.net';
const DB_NAME = process.env.MONGODB_DB || 'girlsfashion';

async function resetAdmin() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  await db.collection('admins').deleteMany({});

  const hashedPassword = bcrypt.hashSync('nobleadmin!', 10);
  await db.collection('admins').insertOne({
    id: randomUUID(),
    name: 'Admin',
    email: 'noblestore252@gmail.com',
    password: hashedPassword,
    role: 'superadmin',
    createdAt: new Date(),
  });

  console.log('Admin reset successfully!');
  console.log('Email: noblestore252@gmail.com');
  console.log('Password: nobleadmin!');
  await client.close();
}

resetAdmin().catch(console.error);
