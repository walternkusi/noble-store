const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const MONGODB_URI = 'mongodb+srv://umusarerw_db_user:ge1u3yCJBYHmsizg@cluster0.sj6ryjb.mongodb.net';
const DB_NAME = 'girlsfashion';

async function resetAdmin() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  await db.collection('admins').deleteMany({});

  const hashedPassword = bcrypt.hashSync('nobleadmin!', 10);
  await db.collection('admins').insertOne({
    id: crypto.randomUUID(),
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
