import { spawn } from 'child_process';

console.log('🚀 Starting Skardu Explore Dev Servers...');

// Start Express Backend
const server = spawn('node', ['server/index.js'], { 
  stdio: 'inherit', 
  shell: true 
});

// Start Vite Frontend
const client = spawn('npx', ['vite'], { 
  stdio: 'inherit', 
  shell: true 
});

// Forward exit signals
const cleanup = () => {
  console.log('\nStopping servers...');
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
