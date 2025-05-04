// A simple Node.js server script to serve the static files
// Run with: node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  console.log('Request URL:', req.url);
  
  // Default to index.html if the request is for the root
  let url = req.url;
  
  if (url === '/') {
    url = '/index.html';
  }
  
  // Handle day URLs without extensions
  if (url.match(/\/days\/day-\d+$/) || url.match(/\/day-\d+$/)) {
    url = url + '.html';
  }
  
  // Resolve the path to the file
  const filePath = path.join(__dirname, url);
  console.log('Serving file:', filePath);
  
  // Get the file extension
  const ext = path.extname(filePath) || '.html';
  
  // Set the content type based on the file extension
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  // Check if the file exists and is not a directory
  fs.stat(filePath, (err, stats) => {
    if (err) {
      handleFileNotFound(req, res);
      return;
    }
    
    if (stats.isDirectory()) {
      // Redirect to index.html in the directory
      res.writeHead(302, { 'Location': path.join(url, 'index.html') });
      res.end();
      return;
    }
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        handleFileNotFound(req, res);
        return;
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

function handleFileNotFound(req, res) {
  console.log('File not found:', req.url);
  
  // Try to serve the 404.html page if it exists
  const notFoundPath = path.join(__dirname, '404.html');
  
  fs.access(notFoundPath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.readFile(notFoundPath, (err, data) => {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(data);
      });
    } else {
      // If 404.html doesn't exist, return a simple message
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 File Not Found</h1><p>The requested URL ' + req.url + ' was not found on this server.</p>');
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Press Ctrl+C to stop the server`);
}); 