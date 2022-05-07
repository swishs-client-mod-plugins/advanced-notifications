const esbuild = require('esbuild');

const { clean } = require('esbuild-plugin-clean');
const { globalExternals } = require('@fal-works/esbuild-plugin-global-externals');

const production = process.argv[2] === 'prod';

esbuild.build({
  // Walks all import statements to transpile every file.
  bundle: true,

  // In case I am dumb and forget to delete code.
  treeShaking: true,

  // Makes ESM import statements transpile to CommonJS.
  platform: 'browser',

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

  outdir: 'dist',
  outbase: 'src',
  sourcemap: 'inline',
  jsx: 'transform',
  entryPoints: [
    'src/reply-modifications/index.ts',
  ],

  // Production settings
  minify: production,
  watch: production ? false : {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error);
      else console.log('watch build succeeded:', result);
    },
  }
}).catch(() => process.exit(1));
