import dns from 'dns';
import pg from 'pg';

const regions = [
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'sa-east-1',
  'us-east-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ca-central-1',
  'ap-south-1'
];

async function checkDNS(hostname) {
  return new Promise((resolve) => {
    dns.lookup(hostname, (err, address) => {
      if (err) {
        resolve(null);
      } else {
        resolve(address);
      }
    });
  });
}

async function testConnection(connectionString) {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    return true;
  } catch (err) {
    return err.message;
  }
}

async function main() {
  console.log('Testing DNS resolutions with dns.lookup...');
  
  // Also try direct db host
  const directHost = 'db.fmlssftftaestdhwgosb.supabase.co';
  const directIP = await checkDNS(directHost);
  if (directIP) {
    console.log(`Resolved direct: ${directHost} -> ${directIP}`);
  }

  for (const region of regions) {
    const hostnames = [
      `aws-0-${region}.pooler.supabase.com`,
      `aws-${region}.pooler.supabase.com`
    ];
    
    for (const host of hostnames) {
      const ip = await checkDNS(host);
      if (ip) {
        console.log(`Resolved: ${host} -> ${ip}`);
        // Test connection
        const connStr = `postgresql://postgres.fmlssftftaestdhwgosb:SkarduExplore2026!@${host}:6543/postgres`;
        console.log(`Testing connection to ${host}...`);
        const result = await testConnection(connStr);
        if (result === true) {
          console.log(`🎉 SUCCESS! Connected to database using host: ${host}`);
          process.exit(0);
        } else {
          console.log(`❌ Failed to connect on ${host}: ${result}`);
        }
      }
    }
  }
  console.log('Finished testing.');
}

main();
