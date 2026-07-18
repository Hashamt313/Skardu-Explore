import pg from 'pg';
import dns from 'dns';

const projectId = 'yuqaegqgtqnevlhcptfz';
const password = 'aWH2akgweRAijOSa';

const regions = [
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-south-1',
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

async function testConn(host, port) {
  const connectionString = `postgresql://postgres.${projectId}:${password}@${host}:${port}/postgres`;
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log(`✅ Success connecting to ${host}:${port}`);
    const res = await client.query('SELECT NOW()');
    console.log('Time:', res.rows[0].now);
    await client.end();
    return true;
  } catch (e) {
    console.log(`❌ Failed connecting to ${host}:${port} - ${e.message}`);
    return false;
  }
}

async function run() {
  console.log('Testing direct host first...');
  await testConn(`db.${projectId}.supabase.co`, 5432);

  console.log('\nTesting regions...');
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const ip = await checkDNS(host);
    if (ip) {
      console.log(`Region ${region} pooler resolves (${ip}). Testing connection...`);
      const success = await testConn(host, 6543);
      if (success) {
        console.log(`\n🎉 Found working region pooler: ${host}`);
        break;
      }
    } else {
      // Try aws-0 without 0?
      const host2 = `aws-${region}.pooler.supabase.com`;
      const ip2 = await checkDNS(host2);
      if (ip2) {
        console.log(`Region ${region} pooler (no-0) resolves (${ip2}). Testing...`);
        const success = await testConn(host2, 6543);
        if (success) {
          console.log(`\n🎉 Found working region pooler: ${host2}`);
          break;
        }
      }
    }
  }
}

run();
