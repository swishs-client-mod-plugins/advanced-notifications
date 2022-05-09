const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const { clean } = require('esbuild-plugin-clean');
const { globalExternals } = require('@fal-works/esbuild-plugin-global-externals');

esbuild.build({
  // Walks all import statements to transpile every file.
  bundle: true,

  // In case I am dumb and forget to delete code.
  treeShaking: true,

  plugins: [
    globalExternals({
      '@logger': {
        varName: 'adn.logger'
      },
      '@apis': {
        varName: 'adn.apis',
        namedExports: ['sendNotification']
      },
      '@apis/settings': {
        varName: 'adn.apis.Settings',
        namedExports: ['create']
      },
      '@patcher': {
        varName: 'adn.patcher'
      }
    }),
    clean({
      patterns: ['dist/**/*']
    })
  ],

  minify: true,
  format: 'iife',
  outdir: 'dist',
  outbase: 'src',
  jsx: 'transform',
  sourcemap: 'inline',
  entryPoints:
    fs.readdirSync('./src')
      .map(dir => path.join('src', dir, 'index.ts'))

}).catch(() => process.exit(1));
