import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import chokidar from 'chokidar';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const opencodeDir = join(__dirname, '..', '..');
const marpBin = join(opencodeDir, 'node_modules', '.bin', 'marp');

export function previewServer(inputFile, port = 3000) {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  
  app.use(express.static('.'));
  
  let currentHtml = '';
  
  function buildHtml() {
    try {
      const output = inputFile.replace('.md', '.html');
      execSync(`${marpBin} ${inputFile} -o ${output}`, { stdio: 'pipe' });
      currentHtml = readFileSync(output, 'utf-8');
      broadcast({ type: 'reload' });
      console.log('[Preview] Rebuild complete');
    } catch (e) {
      console.log('[Preview] Build error:', e.message);
    }
  }
  
  function broadcast(data) {
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  }
  
  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'html', content: currentHtml }));
  });
  
  const watcher = chokidar.watch(inputFile, { persistent: true });
  watcher.on('change', () => {
    console.log('[Preview] File changed, rebuilding...');
    buildHtml();
  });
  
  app.get('/html', (req, res) => {
    res.json({ html: currentHtml });
  });
  
  app.get('/raw/:file', (req, res) => {
    const file = req.params.file;
    if (existsSync(file)) {
      res.sendFile(join(process.cwd(), file));
    } else {
      res.status(404).send('Not found');
    }
  });
  
  server.listen(port, () => {
    console.log(`\n🎨 Live Preview running at http://localhost:${port}`);
    console.log(`   Watching: ${inputFile}`);
    console.log('   Press Ctrl+C to stop\n');
    buildHtml();
  });
  
  process.on('SIGINT', () => {
    console.log('\n[Preview] Stopping server...');
    watcher.close();
    server.close();
    process.exit(0);
  });
}