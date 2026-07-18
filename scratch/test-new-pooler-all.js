import pg from 'pg';
import dns from 'dns';

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ap-southeast-1', 'ap-southeast-2', 'ap-south-1',
  'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3',
  'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
  'eu-north-1', 'sa-east-1', 'ca-central-1', 'me-central-1',
  'af-south-1'
];

async function checkDNS(hostname) {
  return new Promise((resolve) => {
    dns.lookup(hostname, (err, address) => {
      if (err) resolve(null);
      else resolve(address);
    });
  });
}

async function testHost(host) {
  const ip = await checkDNS(host);
  if (!ip) return 'DNS_FAIL';
  
  const connStr = `postgresql://postgres.yuqaegqgtqnevlhcptfz:SkarduExplore2026!@${host}:6543/postgres`;
  const client = new pg.Client({ connectionString: connStr, connectionTimeoutMillis: 3000 });
  try {
    await client.connect();
    await client.end();
    return 'SUCCESS';
  } catch (err) {
    return err.message;
  }
}

async function main() {
  console.log('Testing all hosts...');
  for (const region of regions) {
    const hosts = [
      `aws-0-${region}.pooler.supabase.com`,
      `aws-${region}.pooler.supabase.com`
    ];
    for (const host of hosts) {
      const res = await testHost(host);
      if (res !== 'DNS_FAIL') {
        console.log(`${host}: ${res}`);
        if (res === 'SUCCESS') {
          console.log(`\n🎉 WORKING HOST FOUND: ${host}`);
          process.exit(0);
        }
      }
    }
  }
  console.log('Finished.');
}

main();
