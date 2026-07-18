import dns from 'dns';

dns.lookup('fmlssftftaestdhwgosb.supabase.co', (err, address, family) => {
  if (err) {
    console.error('fmlssftftaestdhwgosb.supabase.co Lookup failed:', err.message);
  } else {
    console.log('fmlssftftaestdhwgosb.supabase.co Resolved to:', address);
  }
});

dns.lookup('db.fmlssftftaestdhwgosb.supabase.co', (err, address, family) => {
  if (err) {
    console.error('db.fmlssftftaestdhwgosb.supabase.co Lookup failed:', err.message);
  } else {
    console.log('db.fmlssftftaestdhwgosb.supabase.co Resolved to:', address);
  }
});
