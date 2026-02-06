const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const watch = process.argv.includes('--watch');

// qjsc path
const QJSC_PATH = path.resolve(__dirname, '../../fuickjs_engine/src/main/jni/quickjs/build/qjsc');

const globalsPlugin = {
  name: 'globals',
  setup(build) {
    build.onResolve({ filter: /^react$/ }, args => ({ path: args.path, namespace: 'globals' }))
    build.onResolve({ filter: /^fuickjs$/ }, args => ({ path: args.path, namespace: 'globals' }))
    build.onLoad({ filter: /.*/, namespace: 'globals' }, args => {
      if (args.path === 'react') return { contents: 'module.exports = globalThis.React', loader: 'js' }
      if (args.path === 'fuickjs') return { contents: 'module.exports = globalThis.FuickFramework', loader: 'js' }
    })
  },
}

async function build() {
  const isProd = !watch;
  const reactPath = isProd
    ? 'node_modules/react/cjs/react.production.min.js'
    : 'node_modules/react/cjs/react.development.js';
  const reconcilerPath = isProd
    ? 'node_modules/react-reconciler/cjs/react-reconciler.production.min.js'
    : 'node_modules/react-reconciler/cjs/react-reconciler.development.js';
  const schedulerPath = isProd
    ? 'node_modules/scheduler/cjs/scheduler.production.min.js'
    : 'node_modules/scheduler/cjs/scheduler.development.js';

  const commonOptions = {
    bundle: true,
    platform: 'neutral',
    format: 'esm',
    target: 'es2020',
    minify: false,
    sourcemap: !isProd,
    loader: {
      '.ts': 'ts',
      '.tsx': 'tsx',
    },
    mainFields: ['module', 'main'],
    define: {
      'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
      global: 'globalThis',
    },
    banner: {
      js: `var process=process||{env:{NODE_ENV:\"${isProd ? 'production' : 'development'}\"}};if(typeof console===\"undefined\"){globalThis.console={log:function(){if(typeof print==='function')print([].slice.call(arguments).join(' '));},error:function(){if(typeof print==='function')print('[ERROR] '+[].slice.call(arguments).join(' '));},warn:function(){if(typeof print==='function')print('[WARN] '+[].slice.call(arguments).join(' '));},debug:function(){if(typeof print==='function')print('[DEBUG] '+[].slice.call(arguments).join(' '));}};}`,
    },
  };

  const destDir = path.resolve(__dirname, '../app/assets/js');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 1. Build Framework
  console.log('Building framework bundle...');
  await esbuild.build({
    ...commonOptions,
    entryPoints: ['src/framework_entry.ts'],
    outfile: 'dist/framework.bundle.js',
    alias: {
      'react': path.resolve(__dirname, reactPath),
      'react-reconciler': path.resolve(__dirname, reconcilerPath),
      'scheduler': path.resolve(__dirname, schedulerPath),
      'fuickjs': path.resolve(__dirname, '../../fuickjs_framework/fuickjs/dist/index.js'),
    },
  });

  // 2. Build Business
  console.log('Building business bundle...');
  await esbuild.build({
    ...commonOptions,
    entryPoints: ['src/index.ts'],
    outfile: 'dist/bundle.js',
    plugins: [globalsPlugin],
    // 不需要 external，由 globalsPlugin 处理 resolve 和 load
  });

  const bundles = [
    { name: 'framework.bundle', src: 'dist/framework.bundle.js' },
    { name: 'bundle', src: 'dist/bundle.js' },
  ];

  for (const b of bundles) {
    const src = path.resolve(__dirname, b.src);
    const dest = path.join(destDir, `${b.name}.js`);
    const destBin = path.join(destDir, `${b.name}.qjc`);

    fs.copyFileSync(src, dest);
    console.log(`Copied ${b.name} to ${dest}`);

    if (fs.existsSync(QJSC_PATH)) {
      console.log(`Compiling ${b.name} to QuickJS bytecode...`);
      execSync(`${QJSC_PATH} -b -o ${destBin} ${src}`);
      console.log(`Compiled to ${destBin}`);
    }
  }

  if (watch) {
    console.log('Watching...');
  } else {
    console.log('Build complete.');
  }
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
