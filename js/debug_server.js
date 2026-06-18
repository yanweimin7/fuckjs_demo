const WebSocket = require('ws');
const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 8080;
const ASSETS_DIR = path.resolve(__dirname, 'assets');
const wss = new WebSocket.Server({ port: PORT });

// 缓存 assets，内容不变时不重复序列化
let _assetsCache = null;

function collectAssets() {
    const files = {};
    function walk(dir, prefix) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const rel = prefix + entry.name;
            if (entry.isDirectory()) {
                walk(path.join(dir, entry.name), rel + '/');
            } else {
                files[rel] = fs.readFileSync(path.join(dir, entry.name)).toString('base64');
            }
        }
    }
    if (fs.existsSync(ASSETS_DIR)) walk(ASSETS_DIR, '');
    const hash = crypto.createHash('md5').update(JSON.stringify(files)).digest('hex');
    _assetsCache = { files, hash };
    console.log(`\x1b[32m[Debug Server] Assets collected: ${Object.keys(files).length} files, hash=${hash}\x1b[0m`);
}

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
    if (clients.length === 0) {
        console.log('\x1b[31m[Debug Server] ⚠ 没有已连接的 Flutter 设备！\x1b[0m');
        console.log('\x1b[31m  请先在 Flutter App 中打开调试控制台（DevFuickAppPage）\x1b[0m');
        return;
    }

    console.log('\x1b[35m[Debug Server] Reading business bundle and sourcemap, sending to clients...\x1b[0m');

    try {
        const businessPath = path.resolve(__dirname, 'dist/bundle.js');
        const businessCode = fs.readFileSync(businessPath, 'utf8');

        let sourceMap = null;
        const sourceMapPath = path.resolve(__dirname, 'dist/bundle.js.map');
        if (fs.existsSync(sourceMapPath)) {
            try {
                sourceMap = JSON.parse(fs.readFileSync(sourceMapPath, 'utf8'));
                console.log(`\x1b[32m[Debug Server] Sourcemap loaded (${sourceMap.sources?.length || 0} sources)\x1b[0m`);
            } catch (e) {
                console.error(`\x1b[31m[Debug Server] Failed to parse sourcemap: ${e.message}\x1b[0m`);
            }
        }

        // 首次构建时收集 assets
        if (!_assetsCache) collectAssets();

        const message = JSON.stringify({
            type: 'reload',
            payload: {
                appName: 'bundle',
                business: businessCode,
                sourceMap: sourceMap,
                assets: _assetsCache,
            }
        });

        clients = clients.filter(c => c.readyState === WebSocket.OPEN);
        clients.forEach(client => { client.send(message); });
        console.log(`\x1b[32m[Debug Server] Sent to ${clients.length} client(s)\x1b[0m`);
    } catch (e) {
        console.error(`\x1b[31m[Debug Server] Failed to read business bundle: ${e.message}\x1b[0m`);
    }
}

function runBuild() {
    console.log('\x1b[34m[Debug Server] Building bundle (with sourcemap)...\x1b[0m');
    exec('npm run build', { env: { ...process.env, SOURCEMAP: 'true' } }, (error, stdout, stderr) => {
        if (error) { console.error(`\x1b[31m[Build Error] ${error.message}\x1b[0m`); return; }
        if (stderr) console.error(`\x1b[31m[Build Stderr] ${stderr}\x1b[0m`);
        console.log(stdout);
        console.log('\x1b[32m[Debug Server] Build completed successfully!\x1b[0m');
        broadcastReload();
    });
}

// 初始编译
runBuild();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

console.log('\x1b[33m[Debug Server] Press "r" to rebuild and reload, "a" to resync assets, "q" to quit\x1b[0m');

rl.on('line', (line) => {
    const input = line.trim().toLowerCase();
    if (input === 'r') {
        runBuild();
    } else if (input === 'a') {
        collectAssets();
        broadcastReload();
    } else if (input === 'q') {
        console.log('\x1b[33m[Debug Server] Shutting down...\x1b[0m');
        process.exit(0);
    }
});
