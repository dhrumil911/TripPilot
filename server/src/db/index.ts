import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

export let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

if (databaseUrl) {
  try {
    const client = postgres(databaseUrl);
    db = drizzle(client, { schema });
    console.log('✅ Database connection initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize database connection:', error);
  }
} else {
  console.warn(
    '⚠️ DATABASE_URL is not configured. Database connection is not established.\n' +
    'The server will continue to run, but database queries will fail.'
  );
}
