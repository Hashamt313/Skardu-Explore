import pg from 'pg';

async function test() {
  const host = 'aws-0-us-east-1.pooler.supabase.com';
  const connStr = `postgresql://postgres.geramxcjpfkpfmxhpnnl:SkarduExplore2026!@${host}:6543/postgres`;
  console.log('Testing connection to:', host);
  const client = new pg.Client({ connectionString: connStr });
  try {
    await client.connect();
    console.log('Success connecting to us-east-1!');
    await client.end();
  } catch (err) {
    console.error('Error connecting to us-east-1:', err.message);
  }
}

test();
