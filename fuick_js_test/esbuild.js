const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const watch = process.argv.includes('--watch');

// qjsc path
const QJSC_PATH = path.resolve(__dirname, '../../fuickjs_engine/src/main/jni/quickjs/build/qjsc');
const PROJECT_NAME = 'fuick_js_test';
const isProd = !watch;

// react/reconciler paths (shared from main js node_modules)
const mainJsDir = path.resolve(__dirname, '../js');
const reactPath = isProd
  ? path.join(mainJsDir, 'node_modules/react/cjs/react.production.min.js')
  : path.join(mainJsDir, 'node_modules/react/cjs/react.development.js');
const reconcilerPath = isProd
  ? path.join(mainJsDir, 'node_modules/react-reconciler/cjs/react-reconciler.production.min.js')
  : path.join(mainJsDir, 'node_modules/react-reconciler/cjs/react-reconciler.development.js');
const schedulerPath = isProd
  ? path.join(mainJsDir, 'node_modules/scheduler/cjs/scheduler.production.min.js')
  : path.join(mainJsDir, 'node_modules/scheduler/cjs/scheduler.development.js');

const globalsPlugin = {
  name: 'globals',
  setup(build) {
    build.onResolve({ filter: /^react$/ }, args => ({ path: args.path, namespace: 'globals' }))
    build.onResolve({ filter: /^fuick_js_framework$/ }, args => ({ path: args.path, namespace: 'globals' }))
    build.onLoad({ filter: /.*/, namespace: 'globals' }, args => {
      if (args.path === 'react') return { contents: 'module.exports = globalThis.React', loader: 'js' }
      if (args.path === 'fuick_js_framework') return { contents: 'module.exports = globalThis.FuickFramework', loader: 'js' }
    })
  },
}

const commonOptions = {
  bundle: true,
  platform: 'neutral',
  format: 'iife',
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

async function runBuild() {
  const destDir = path.resolve(__dirname, '../app/assets/js');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 1. Build Framework
  console.log('Building framework bundle...');
  await esbuild.build({
    ...commonOptions,
    entryPoints: [path.join(mainJsDir, 'src/framework_entry.ts')],
    outfile: 'dist/framework.bundle.js',
    alias: {
      'react': reactPath,
      'react-reconciler': reconcilerPath,
      'scheduler': schedulerPath,
      'fuick_js_framework': path.resolve(__dirname, '../fuick_js_framework/dist/index.js'),
    },
  });

  // 2. Build Test Project
  console.log(`Building ${PROJECT_NAME} bundle...`);
  await esbuild.build({
    ...commonOptions,
    entryPoints: ['src/index.ts'],
    outfile: `dist/${PROJECT_NAME}.js`,
    plugins: [globalsPlugin],
  });

  const bundles = [
    { name: 'framework.bundle', src: 'dist/framework.bundle.js' },
    { name: PROJECT_NAME, src: `dist/${PROJECT_NAME}.js` },
  ];

  for (const b of bundles) {
    const src = path.resolve(__dirname, b.src);
    const dest = path.join(destDir, `${b.name}.js`);
    const destBin = path.join(destDir, `${b.name}.qjc`);

    try {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${b.name} to ${dest}`);

      if (fs.existsSync(QJSC_PATH)) {
        console.log(`Compiling ${b.name} to QuickJS bytecode...`);
        execSync(`${QJSC_PATH} -b -o ${destBin} ${src}`);
        console.log(`Compiled to ${destBin}`);
      }
    } catch (e) {
      console.error(`Failed to process ${b.name}:`, e);
    }
  }

  if (watch) {
    console.log('Watching...');
  } else {
    console.log('Build complete.');
  }
}

runBuild().catch(err => {
  console.error(err);
  process.exit(1);
});
