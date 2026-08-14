const http = require('http');
const fs = require('fs');
const path = require('path');

// Minimal .env.local loader (no dotenv dependency)
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const ROOT = path.join(__dirname, '..');
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.ico': 'image/x-icon',
};

async function readRawBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}

const apiHandlers = {
  '/api/load': require(path.join(ROOT, 'api', 'load.js')),
  '/api/save': require(path.join(ROOT, 'api', 'save.js')),
  '/api/login': require(path.join(ROOT, 'api', 'login.js')),
  '/api/upload-resume': require(path.join(ROOT, 'api', 'upload-resume.js')),
  '/api/resume': require(path.join(ROOT, 'api', 'resume.js')),
};

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  if (apiHandlers[url]) {
    // Give handlers a raw readable stream to consume themselves (matches how
    // api/upload-resume.js and api/resume.js read the request body directly),
    // and attach an Express-like res so api/load.js, api/save.js, api/login.js
    // (which call res.status().json()) keep working unmodified.
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
    return apiHandlers[url](req, res);
  }

  let filePath = path.join(ROOT, url === '/' ? 'index.html' : decodeURIComponent(url));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Local dev server: http://localhost:${PORT}`));
