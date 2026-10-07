const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 65500;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function send(res, status, body, type = 'text/plain; charset=utf-8', headers = {}) {
  res.writeHead(status, { 'Content-Type': type, ...headers });
  res.end(body);
}

// Turns the request URL into a file path inside ROOT, or null if it is not allowed.
function resolvePath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }

  // Hidden files and folders (e.g. .git) are never served.
  if (decoded.split('/').some((part) => part.startsWith('.') && part !== '.' && part !== '..')) {
    return null;
  }

  const filePath = path.normalize(path.join(ROOT, decoded));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    return null;
  }
  return filePath;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const filePath = resolvePath(urlPath);
  if (!filePath) {
    send(res, 404, 'Not found');
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr) {
      send(res, 404, 'Not found');
      return;
    }

    // Folder URLs need a trailing slash so relative links in index.html work.
    if (stats.isDirectory() && !urlPath.endsWith('/')) {
      send(res, 301, '', 'text/plain', { Location: `${urlPath}/` });
      return;
    }

    const target = stats.isDirectory() ? path.join(filePath, 'index.html') : filePath;
    fs.readFile(target, (readErr, data) => {
      if (readErr) {
        send(res, 404, 'Not found');
        return;
      }
      const type = MIME_TYPES[path.extname(target).toLowerCase()] || 'application/octet-stream';
      send(res, 200, data, type);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/todomvc/`);
});
