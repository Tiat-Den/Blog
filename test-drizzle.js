const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const { pgTable, varchar, integer } = require('drizzle-orm/pg-core');
const { sql } = require('drizzle-orm');

const pool = new Pool({ connectionString: 'postgres://postgres.rdheotxnkhyokzhdirhm:Geh1CDjAjVBpEQmY@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x', ssl: { rejectUnauthorized: false } });
const db = drizzle(pool);
const views = pgTable('views', {
  slug: varchar('slug', { length: 255 }).primaryKey(),
  count: integer('count').default(0).notNull(),
});

db.insert(views).values({ slug: 'app-ql-qr', count: 1 }).onConflictDoUpdate({
  target: views.slug,
  set: { count: sql`views.count + 1` }
}).returning().then(res => {
  console.log('SUCCESS:', res);
  process.exit(0);
}).catch(err => {
  console.error('FULL ERROR:', err);
  process.exit(1);
});
