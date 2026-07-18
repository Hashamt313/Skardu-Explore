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
  const projectRef = 'geramxcjpfkpfmxhpnnl';
  console.log(`Testing DNS resolutions for project ref: ${projectRef}`);
  
  const directHost = `db.${projectRef}.supabase.co`;
  const directIP = await checkDNS(directHost);
  if (directIP) {
    console.log(`Resolved direct: ${directHost} -> ${directIP}`);
    const connStr = `postgresql://postgres:${encodeURIComponent('SkarduExplore2026!')}@${directHost}:5432/postgres`;
    const res = await testConnection(connStr);
    if (res === true) {
      console.log(`🎉 SUCCESS! Connected direct!`);
      process.exit(0);
    } else {
      console.log(`❌ Failed direct connection: ${res}`);
    }
  } else {
    console.log(`❌ Could not resolve direct host: ${directHost}`);
  }

  for (const region of regions) {
    const hostnames = [
      `aws-0-${region}.pooler.supabase.com`,
      `aws-${region}.pooler.supabase.com`
    ];
    
    for (const host of hostnames) {
      const ip = await checkDNS(host);
      if (ip) {
        // Test connection using transaction pooler
        const connStr = `postgresql://postgres.${projectRef}:${encodeURIComponent('SkarduExplore2026!')}@${host}:6543/postgres`;
        console.log(`Testing pooler ${host} for project ${projectRef}...`);
        const result = await testConnection(connStr);
        if (result === true) {
          console.log(`🎉 SUCCESS! Connected via pooler: ${host}`);
          console.log(`Your correct DATABASE_URL should be: ${connStr}`);
          process.exit(0);
        } else {
          if (!result.includes('tenant/user')) {
            console.log(`❌ Connection failed on ${host}: ${result}`);
          }
        }
      }
    }
  }
  console.log('Finished testing.');
}

main();
