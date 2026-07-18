import pg from 'pg';

const test = async () => {
  const projectId = 'yuqaegqgtqnevlhcptfz';
  const password = 'aWH2akgweRAijOSa';
  const host = 'aws-0-ap-south-1.pooler.supabase.com';
  
  const ports = [6543, 5432];
  for (const port of ports) {
    const connStr = `postgresql://postgres.${projectId}:${password}@${host}:${port}/postgres`;
    console.log(`Testing host ${host} on port ${port}...`);
    const client = new pg.Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      console.log(`✅ Success on port ${port}!`);
      await client.end();
      break;
    } catch (e) {
      console.error(`❌ Failed on port ${port}:`, e.message);
    }
  }
};

test();
