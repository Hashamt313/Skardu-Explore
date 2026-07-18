import pg from 'pg';

const test = async () => {
  const connStr = `postgresql://postgres:aWH2akgweRAijOSa@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;
  console.log('Testing with username: postgres');
  const client = new pg.Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log('✅ Connected!');
    await client.end();
  } catch (e) {
    console.error('❌ Failed:', e.message);
  }
};

test();
