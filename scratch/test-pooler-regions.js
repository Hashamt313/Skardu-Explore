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

async function testRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const ip = await checkDNS(host);
  if (!ip) {
    return `DNS lookup failed for ${host}`;
  }
  
  const connStr = `postgresql://postgres.geramxcjpfkpfmxhpnnl:SkarduExplore2026!@${host}:6543/postgres`;
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
  console.log('Starting pooler test across regions...');
  for (const region of regions) {
    const res = await testRegion(region);
    console.log(`Region ${region}: ${res}`);
    if (res === 'SUCCESS') {
      console.log(`\n🎉 Found working region: ${region}`);
      break;
    }
  }
  console.log('Finished testing all regions.');
}

main();
