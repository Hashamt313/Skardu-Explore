import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    console.log('Testing connection to:', process.env.DATABASE_URL);
    const timeRes = await pool.query('SELECT NOW()');
    console.log('Connected! DB time:', timeRes.rows[0].now);

    // List all tables
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in database:', tablesRes.rows.map(r => r.table_name));

    // Try querying fleet
    const fleetRes = await pool.query('SELECT * FROM fleet LIMIT 1');
    console.log('Fleet query successful, rows count:', fleetRes.rows.length);

  } catch (err) {
    console.error('Database query failed:', err);
  } finally {
    await pool.end();
  }
}

test();
