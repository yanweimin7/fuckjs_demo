const esbuild = require('esbuild');
const path = require('path');

async function build() {
  try {
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      outfile: '../app/assets/js/framework.bundle.js',
      format: 'iife',
      globalName: 'FuickJS',
      platform: 'browser',
      target: ['es2020'],
      minify: false,
      sourcemap: true,
    });
    console.log('Build successful');
  } catch (e) {
    console.error('Build failed', e);
    process.exit(1);
  }
}

build();
