import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import chokidar from 'chokidar';
import { readFileSync, existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..', '..');
const MARP_BIN = join(ROOT_DIR, 'node_modules', '.bin', 'marp');

export function previewServer(inputFile, port = 3000) {
  if (!existsSync(MARP_BIN)) {
    console.error('Error: Marp CLI not found. Run: npm install');
    process.exit(1);
  }
  
  if (!existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }
  
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  
  app.use(express.static(process.cwd()));
  app.use(express.json());
  
  let currentHtml = '';
  
  function buildHtml() {
    try {
      const output = inputFile.replace('.md', '.html');
      execSync(`${MARP_BIN} ${inputFile} -o ${output}`, { stdio: 'pipe' });
      currentHtml = readFileSync(output, 'utf-8');
      broadcast({ type: 'reload' });
      console.log('[Preview] Rebuild complete');
    } catch (e) {
      console.error('[Preview] Build error:', e.message);
      broadcast({ type: 'error', message: e.message });
    }
  }
  
  function broadcast(data) {
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  }
  
  wss.on('connection', (ws, req) => {
    console.log(`[Preview] Client connected from ${req.socket.remoteAddress}`);
    ws.send(JSON.stringify({ type: 'connected' }));
    if (currentHtml) {
      ws.send(JSON.stringify({ type: 'html', content: currentHtml }));
    }
  });
  
  const watcher = chokidar.watch(inputFile, { 
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    }
  });
  
  watcher.on('change', (path) => {
    console.log(`[Preview] ${path} changed, rebuilding...`);
    buildHtml();
  });
  
  watcher.on('error', (error) => {
    console.error('[Preview] Watcher error:', error);
  });
  
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', watching: inputFile });
  });
  
  app.get('/html', (req, res) => {
    res.json({ html: currentHtml });
  });
  
  app.get('/rebuild', (req, res) => {
    buildHtml();
    res.json({ status: 'rebuilding' });
  });
  
  const serverInstance = server.listen(port, () => {
    console.log(`\n  Live Preview running at http://localhost:${port}`);
    console.log(`  Watching: ${inputFile}`);
    console.log('  Press Ctrl+C to stop\n');
    buildHtml();
  });
  
  process.on('SIGINT', () => {
    console.log('\n[Preview] Stopping server...');
    watcher.close();
    serverInstance.close(() => {
      console.log('[Preview] Server stopped');
      process.exit(0);
    });
  });
  
  process.on('SIGTERM', () => {
    console.log('\n[Preview] Server terminated');
    watcher.close();
    serverInstance.close();
    process.exit(0);
  });
}