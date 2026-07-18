import pg from 'pg';

const test = async () => {
  const projectId = 'yuqaegqgtqnevlhcptfz';
  const password = 'aWH2akgweRAijOSa';
  const host = 'aws-0-ap-south-1.pooler.supabase.com';
  const connStr = `postgresql://postgres.${projectId}:${password}@${host}:6543/postgres`;
  
  console.log('Testing Mumbai pooler with connection string:', connStr);
  const client = new pg.Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log('✅ Connected successfully to Mumbai pooler!');
    const res = await client.query('SELECT NOW()');
    console.log('Time:', res.rows[0].now);
    await client.end();
  } catch (e) {
    console.error('❌ Failed:', e.message);
  }
};

test();
