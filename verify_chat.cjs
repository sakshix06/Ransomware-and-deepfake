const http = require('http');

const data = JSON.stringify({
  message: "Hello, describe RansomGuard features.",
  history: []
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/ransomware/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response Body:', body);
    try {
      const json = JSON.parse(body);
      if (json.reply) {
        console.log('✅ Success: API returned a reply field.');
      } else {
        console.error('❌ Error: API did not return a reply field.');
      }
    } catch (e) {
      console.error('❌ Error: Response was not valid JSON.');
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request Error: ${e.message}`);
});

req.write(data);
req.end();
