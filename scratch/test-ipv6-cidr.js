import ipaddr from 'ipaddr.js'; // Wait, do we have ipaddr.js installed? Let's check package.json: no.
// We can write a simple native IPv6 subnet check.
// An IPv6 address has 8 groups of 16 bits.
// We can parse the target address and each prefix to a BigInt or an array of numbers, then compare bits.

const targetIpStr = '2406:da1a:82a:9d02:1cb4:afad:e2f6:496';

function parseIpv6(ipStr) {
  // Expand ::
  let parts = ipStr.split(':');
  if (parts.length < 8) {
    const emptyIndex = parts.indexOf('');
    const missingCount = 8 - parts.length + 1;
    const padding = new Array(missingCount).fill('0');
    parts.splice(emptyIndex, 1, ...padding);
  }
  return parts.map(p => parseInt(p || '0', 16));
}

function ipToBinaryString(parsedIp) {
  return parsedIp.map(n => n.toString(2).padStart(16, '0')).join('');
}

async function run() {
  const targetIpBinary = ipToBinaryString(parseIpv6(targetIpStr));
  
  const res = await fetch('https://ip-ranges.amazonaws.com/ip-ranges.json');
  const data = await res.json();
  
  const matches = [];
  for (const prefixObj of data.ipv6_prefixes) {
    const [prefixIp, bitsStr] = prefixObj.ipv6_prefix.split('/');
    const bits = parseInt(bitsStr, 10);
    const prefixBinary = ipToBinaryString(parseIpv6(prefixIp));
    
    if (targetIpBinary.substring(0, bits) === prefixBinary.substring(0, bits)) {
      matches.push(prefixObj);
    }
  }
  
  console.log('Target IP:', targetIpStr);
  console.log('Matching AWS prefixes:', matches);
}

run();
