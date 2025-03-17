import { execSync } from 'child_process';
import { build } from 'esbuild';
import copyStaticFiles from 'esbuild-copy-static-files';
import fs from 'fs/promises';
import path from 'path';

async function minifyJSON(dir = './dist/metadata') {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await minifyJSON(filePath); // 🔄 Recursively process subdirectories
      } else if (file.endsWith('.json')) {
        // 🛠 Fix: Use JSON.stringify() instead of `json-minify`
        const data = await fs.readFile(filePath, 'utf8');
        const jsonObject = JSON.parse(data); // 🛠 Read & parse JSON
        const minifiedData = JSON.stringify(jsonObject); // ✅ Minify using JSON.stringify()

        await fs.writeFile(filePath, minifiedData, 'utf8');
        console.log(`✅ Minified: ${filePath}`);
      }
    }
  } catch (err) {
    console.error(`❌ Error minifying JSON: ${err.message}`);
  }
}

async function fixMetadataImport() {
  const filePath = './dist/index.js';
  try {
    let content = await fs.readFile(filePath, 'utf8');
    content = content.replace(/["']\.\.\/src\/metadata["']/g, '\'./metadata\'');
    await fs.writeFile(filePath, content, 'utf8');
    console.log('✅ Fixed metadata import in dist/index.js');
  } catch (err) {
    console.error(`❌ Failed to fix metadata import: ${err.message}`);
  }
}

async function buildProject() {
  try {
    // 1️⃣ Build ES Modules (`.js`)
    await build({
      entryPoints: ['./src/index.ts'],
      bundle: true,
      outfile: './dist/index.js',
      platform: 'node',
      target: 'esnext',
      format: 'esm',
      external: ['./src/metadata'],
      sourcemap: false,
      resolveExtensions: ['.ts', '.tsx', '.js', '.json'],
      plugins: [
        copyStaticFiles({
          src: './src/metadata',
          dest: './dist/metadata',
        }),
      ],
    });
    console.log('✅ esbuild completed.');

    // 1️⃣ Build CommonJS (`.cjs`)
    await build({
      entryPoints: ['./src/index.ts'],
      outfile: './dist/index.cjs',
      platform: 'node',
      target: 'esnext',
      format: 'cjs',
      sourcemap: false,
      plugins: [
        copyStaticFiles({
          src: './src/metadata',
          dest: './dist/metadata',
        }),
      ],
    });
    console.log('✅ commonjs build completed.');

    await fixMetadataImport();

    // 2️⃣ Run `tsc` to generate `.d.ts` files
    execSync('tsc', { stdio: 'inherit' });
    console.log('✅ TypeScript compiled.');

    // 3️⃣ Ensure JSON minification runs after copy is complete
    setTimeout(async () => {
      await minifyJSON();
      console.log('🚀 JSON minification completed.');
    }, 500);
  } catch (err) {
    console.error(`❌ Build failed: ${err.message}`);
    process.exit(1);
  }
}

buildProject();
