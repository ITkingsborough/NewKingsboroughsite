import * as https from 'https';

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

const html = await fetchPage('https://www.forevermissed.com/apostletunde-balogun/tributes');
console.log('HTML length:', html.length);

const nextData = html.match(/<script[^>]*__NEXT_DATA__[^>]*>([\s\S]*?)<\/script>/i);
if (nextData) {
  console.log('NEXT_DATA found, length:', nextData[1].length);
  const parsed = JSON.parse(nextData[1]);
  console.log('Keys:', Object.keys(parsed));
  console.log('Props keys:', Object.keys(parsed.props || {}));
  const str = JSON.stringify(parsed, null, 2);
  // Find tributes
  const idx = str.indexOf('tribute');
  if (idx !== -1) console.log('Tribute context:', str.slice(Math.max(0,idx-50), idx+500));
} else {
  console.log('No __NEXT_DATA__, looking for API endpoints...');
  const apis = [...new Set((html.match(/\/api\/[^"'\s<>]{3,80}/g) || []))];
  console.log('API endpoints:', apis.slice(0, 30));
  // Look for fetch/axios calls in inline scripts
  const inlineScripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log('Inline script count:', inlineScripts.length);
  const firstScript = inlineScripts[0] || '';
  console.log('First script snippet:', firstScript.slice(0, 300));
  // Sample first 2000 chars of HTML
  console.log('\nHTML snippet:', html.slice(0, 3000));
}
