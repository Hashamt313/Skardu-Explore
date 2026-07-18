import pg from 'pg';
import dns from 'dns';

async function test() {
  const host = 'db.yuqaegqgtqnevlhcptfz.supabase.co';
  const password = 'aWH2akgweRAijOSa';
  
  console.log('Resolving IPv6 address for:', host);
  dns.lookup(host, { family: 6 }, async (err, address) => {
    if (err) {
      console.error('❌ Failed to resolve IPv6:', err.message);
      return;
    }
    console.log('✅ Resolved IPv6 to:', address);
    
    // Connect using resolved IP or hostname
    const connStr = `postgresql://postgres:${password}@[${address}]:5432/postgres`;
    console.log('Connecting with connection string:', connStr);
    
    const client = new pg.Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false }
    });
    
    try {
      await client.connect();
      console.log('🎉 SUCCESS! Connected directly via IPv6!');
      const res = await client.query('SELECT NOW()');
      console.log('Time:', res.rows[0].now);
      
      // Let's print tables
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      console.log('Tables:', tables.rows.map(r => r.table_name));
      
      await client.end();
    } catch (e) {
      console.error('❌ Connection failed:', e.message);
    }
  });
}

test();
