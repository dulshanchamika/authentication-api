import { db } from './src/config/database.js';
import { users } from './src/models/user.model.js';

async function makeAdmin() {
  console.log('Promoting all users to admin...');
  await db.update(users).set({ role: 'admin' });
  console.log('Done!');
  process.exit(0);
}

makeAdmin();
