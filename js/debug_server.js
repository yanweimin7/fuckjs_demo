const WebSocket = require('ws');
const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`\x1b[32m[Debug Server] WebSocket server started on ws://localhost:${PORT}\x1b[0m`);

let clients = [];

wss.on('connection', (ws) => {
    console.log('\x1b[36m[Debug Server] Flutter client connected\x1b[0m');
    clients.push(ws);

    ws.on('close', () => {
        console.log('\x1b[33m[Debug Server] Flutter client disconnected\x1b[0m');
        clients = clients.filter(c => c !== ws);
    });
});

function broadcastReload() {
    console.log('\x1b[35m[Debug Server] Reading business bundle and sending to clients...\x1b[0m');

    try {
        const businessPath = path.resolve(__dirname, 'dist/bundle.js');
        const businessCode = fs.readFileSync(businessPath, 'utf8');

        const message = JSON.stringify({
            type: 'reload',
            payload: {
                business: businessCode
            }
        });

        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
        console.log('\x1b[32m[Debug Server] Business bundle sent successfully!\x1b[0m');
    } catch (e) {
        console.error(`\x1b[31m[Debug Server] Failed to read business bundle: ${e.message}\x1b[0m`);
    }
}

function runBuild() {
    console.log('\x1b[34m[Debug Server] Building bundle...\x1b[0m');
    exec('npm run build', (error, stdout, stderr) => {
        if (error) {
            console.error(`\x1b[31m[Build Error] ${error.message}\x1b[0m`);
            return;
        }
        if (stderr) {
            console.error(`\x1b[31m[Build Stderr] ${stderr}\x1b[0m`);
        }
        console.log(stdout);
        console.log('\x1b[32m[Debug Server] Build completed successfully!\x1b[0m');
        broadcastReload();
    });
}

// 初始编译一次
runBuild();

// 监听键盘输入
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.log('\x1b[33m[Debug Server] Press "r" to rebuild and reload, "q" to quit\x1b[0m');

rl.on('line', (line) => {
    const input = line.trim().toLowerCase();
    if (input === 'r') {
        runBuild();
    } else if (input === 'q') {
        console.log('\x1b[33m[Debug Server] Shutting down...\x1b[0m');
        process.exit(0);
    }
});
