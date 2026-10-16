import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** Gera dist/sw.js com a lista de todos os ficheiros da app (pré-cache completo). */
function serviceWorker() {
  return {
    name: 'fastreport-sw',
    apply: 'build',
    generateBundle(_, bundle) {
      const files = Object.keys(bundle).filter((f) => !f.endsWith('.map'));
      const pub = walk('public').map((p) => relative('public', p).split('\\').join('/'));
      const assets = ['./', './index.html', ...[...files, ...pub].filter((f) => f !== 'sw.js' && f !== 'index.html').map((f) => `./${f}`)];
      const version = createHash('sha256').update(assets.join('|') + JSON.stringify(Object.values(bundle).map((b) => b.code ?? '').join('').length)).digest('hex').slice(0, 10);
      const code = readFileSync('sw-template.js', 'utf8')
        .replace('__VERSION__', version)
        .replace('__ASSETS__', JSON.stringify(assets, null, 2));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: code });
    }
  };
}

export default defineConfig({
  plugins: [svelte(), serviceWorker()],
  base: './',
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 }
});
