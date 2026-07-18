import dns from 'dns';

dns.lookup('yuqaegqgtqnevlhcptfz.supabase.co', (err, ip) => {
  if (err) console.error('Error:', err);
  else console.log('Resolved yuqaegqgtqnevlhcptfz.supabase.co to:', ip);
});

dns.lookup('db.yuqaegqgtqnevlhcptfz.supabase.co', (err, ip) => {
  if (err) console.error('Error db:', err);
  else console.log('Resolved db.yuqaegqgtqnevlhcptfz.supabase.co to:', ip);
});
