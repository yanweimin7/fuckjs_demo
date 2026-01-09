const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const watch = process.argv.includes('--watch');

// qjsc path
const QJSC_PATH = path.resolve(__dirname, '../../fuickjs_engine/src/main/jni/quickjs/build/qjsc');
const PROJECT_NAME = 'fuick_js_test';

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
  mainFields: ['module', 'main'],
  alias: {
    'react': path.resolve(__dirname, 'node_modules/react/cjs/react.development.js'),
    'react-reconciler': path.resolve(__dirname, 'node_modules/react-reconciler/cjs/react-reconciler.development.js'),
    'scheduler': path.resolve(__dirname, 'node_modules/scheduler/cjs/scheduler.development.js'),
    'fuick_js_framework': path.resolve(__dirname, '../fuick_js_framework/dist/index.js'),
  },
  define: {
    'process.env.NODE_ENV': '"development"',
    global: 'globalThis',
  },
  banner: {
    js: 'var process=process||{env:{NODE_ENV:\"development\"}};',
  },
  outfile: `dist/${PROJECT_NAME}.js`,
}).then(result => {
  const src = path.resolve(__dirname, `dist/${PROJECT_NAME}.js`);
  const destDir = path.resolve(__dirname, '../app/assets/js');
  const dest = path.join(destDir, `${PROJECT_NAME}.js`);
  const destBin = path.join(destDir, `${PROJECT_NAME}.qjc`);

  try {
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
    console.log('Copied bundle to', dest);

    // Compile to bytecode
    if (fs.existsSync(QJSC_PATH)) {
      console.log('Compiling to QuickJS bytecode...');
      execSync(`${QJSC_PATH} -b -o ${destBin} ${src}`);
      console.log('Compiled to', destBin);
    } else {
      console.warn('qjsc not found at', QJSC_PATH, ', skipping bytecode compilation.');
    }

  } catch (e) {
    console.error('Build/Copy failed:', e);
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
