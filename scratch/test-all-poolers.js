import pg from 'pg';
import dns from 'dns';

const projectId = 'yuqaegqgtqnevlhcptfz';
const password = 'aWH2akgweRAijOSa';

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'sa-east-1',
  'ca-central-1'
];

async function checkDNS(hostname) {
  return new Promise((resolve) => {
    dns.lookup(hostname, (err, address) => {
      if (err) resolve(null);
      else resolve(address);
    });
  });
}

async function testConnection(host) {
  const connStr = `postgresql://postgres.${projectId}:${password}@${host}:6543/postgres`;
  const client = new pg.Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

async function main() {
  console.log(`Starting check for project ${projectId}...`);
  for (const region of regions) {
    const hosts = [
      `aws-0-${region}.pooler.supabase.com`,
      `aws-${region}.pooler.supabase.com`
    ];
    for (const host of hosts) {
      const ip = await checkDNS(host);
      if (ip) {
        console.log(`Testing ${host} (${ip})...`);
        const res = await testConnection(host);
        if (res.success) {
          console.log(`\n🎉 SUCCESS! Connected to database using host: ${host}`);
          console.log(`Correct DATABASE_URL is: postgresql://postgres.${projectId}:${password}@${host}:6543/postgres`);
          process.exit(0);
        } else {
          console.log(`   Result: ${res.message}`);
        }
      } else {
        console.log(`Could not resolve DNS for ${host}`);
      }
    }
  }
  console.log('All checks finished.');
}

main();
