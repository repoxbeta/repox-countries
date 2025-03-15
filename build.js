import { build } from 'esbuild';

build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: './dist/index.js',
  resolveExtensions: ['.ts', '.tsx', '.js', '.json'],
}).catch(() => process.exit(1));
