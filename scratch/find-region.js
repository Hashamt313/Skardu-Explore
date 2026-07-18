const url = 'https://ip-ranges.amazonaws.com/ip-ranges.json';

async function run() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    // We are looking for an IPv6 range containing 2406:da1a:82a:9d02:1cb4:afad:e2f6:496
    // Or just filter IPv6 prefixes starting with 2406:da1a
    const matches = data.ipv6_prefixes.filter(p => p.ipv6_prefix.startsWith('2406:da1a'));
    console.log('Matches:', matches);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
