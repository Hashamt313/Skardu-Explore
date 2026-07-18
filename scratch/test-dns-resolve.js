import { Resolver } from 'dns/promises';
import pg from 'pg';

async function test() {
  const host = 'db.yuqaegqgtqnevlhcptfz.supabase.co';
  const password = 'aWH2akgweRAijOSa';
  
  console.log('Resolving AAAA record for:', host, 'using Google DNS...');
  const resolver = new Resolver();
  resolver.setServers(['8.8.8.8']);
  
  try {
    const addresses = await resolver.resolve4(host).catch(() => []);
    console.log('IPv4 Addresses:', addresses);
    
    const ipv6Addresses = await resolver.resolve6(host).catch(() => []);
    console.log('IPv6 Addresses:', ipv6Addresses);
    
    if (ipv6Addresses.length === 0) {
      console.error('❌ No IPv6 address resolved.');
      return;
    }
    
    const address = ipv6Addresses[0];
    const connStr = `postgresql://postgres:${password}@[${address}]:5432/postgres`;
    console.log('Connecting directly via IPv6 IP:', connStr);
    
    const client = new pg.Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    console.log('🎉 SUCCESS! Connected directly to IPv6 address!');
    const res = await client.query('SELECT NOW()');
    console.log('Time:', res.rows[0].now);
    
    // Print tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', tables.rows.map(r => r.table_name));
    
    await client.end();
  } catch (err) {
    console.error('❌ Error/Connection failed:', err.message);
  }
}

test();
