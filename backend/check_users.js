import { db } from './src/config/database.js';
import { users } from './src/models/user.model.js';

async function checkUsers() {
  const allUsers = await db.select().from(users);
  console.log('Users in DB:', allUsers);
  process.exit(0);
}

checkUsers();
