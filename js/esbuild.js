const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const watch = process.argv.includes('--watch');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'neutral',
  format: 'iife',
  target: 'es2020',
  minify: false,
  sourcemap: true,
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
  },
  alias: {
    'react': path.resolve(__dirname, 'node_modules/react/cjs/react.development.js'),
    'react-reconciler': path.resolve(__dirname, 'node_modules/react-reconciler/cjs/react-reconciler.development.js'),
    'scheduler': path.resolve(__dirname, 'node_modules/scheduler/cjs/scheduler.development.js'),
  },
  define: {
    'process.env.NODE_ENV': '"development"',
    global: 'globalThis',
  },
  banner: {
    js: 'var process=process||{env:{NODE_ENV:\"development\"}};',
  },
  outfile: 'dist/bundle.js',
}).then(result => {
  const src = path.resolve(__dirname, 'dist/bundle.js');
  const destDir = path.resolve(__dirname, '../app/assets/js');
  const dest = path.join(destDir, 'bundle.js');
  try {
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
    console.log('Copied bundle to', dest);
  } catch (e) {
    console.error('Copy bundle failed:', e);
    process.exitCode = 1;
  }
  if (watch) {
    console.log('Watching...');
  } else {
    console.log('Build complete.');
  }
}).catch(err => {
  console.error(err);
  process.exit(1);
});
