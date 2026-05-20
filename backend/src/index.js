import 'dotenv/config';
import app from './app.js';
import { db } from '#config/database.js';

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Running database migrations in production...');
      const { migrate } = await import('drizzle-orm/neon-http/migrator');
      await migrate(db, { migrationsFolder: './drizzle' });
      console.log('✅ Database migrations completed successfully.');
    }
  } catch (error) {
    console.error('❌ Failed to run database migrations:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
