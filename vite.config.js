import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { visualizer } from 'rollup-plugin-visualizer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORK_SRC_DIR = path.resolve(__dirname, 'work');
const WORK_PAGES = ['portraits', 'automotive', 'athletes'];

/**
 * Single source of truth for work story HTML pages: `/work/*.html`.
 * - In dev: reads files from disk and serves them (handles both `/work/portraits` and `/work/portraits.html`).
 * - At build: copies `work/*.html` into `dist/work/*.html` so Vercel can serve them.
 */
function workPages() {
  const matchPath = (rawUrl) => {
    const pathname = (rawUrl.split('?')[0] ?? '').replace(/\/$/, '') || '/';
    const m = pathname.match(/^\/work\/([a-z0-9-]+)(?:\.html)?$/i);
    if (!m) return null;
    const name = m[1].toLowerCase();
    return WORK_PAGES.includes(name) ? name : null;
  };

  const serveMiddleware = (req, res, next) => {
    const name = matchPath(req.url ?? '');
    if (!name) return next();
    const file = path.join(WORK_SRC_DIR, `${name}.html`);
    fs.readFile(file, 'utf8', (err, html) => {
      if (err) return next();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.end(html);
    });
  };

  return {
    name: 'lemoose-work-pages',
    configureServer(server) {
      server.watcher.add(WORK_SRC_DIR);
      server.watcher.on('change', (file) => {
        if (file.startsWith(WORK_SRC_DIR) && file.endsWith('.html')) {
          server.ws.send({ type: 'full-reload', path: '*' });
        }
      });
      server.middlewares.use(serveMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveMiddleware);
    },
    closeBundle() {
      const distWorkDir = path.resolve(__dirname, 'dist', 'work');
      fs.mkdirSync(distWorkDir, { recursive: true });
      for (const name of WORK_PAGES) {
        const src = path.join(WORK_SRC_DIR, `${name}.html`);
        const dst = path.join(distWorkDir, `${name}.html`);
        fs.copyFileSync(src, dst);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    workPages(),
    cssInjectedByJsPlugin(),
    visualizer({ open: false, filename: 'dist/stats.html' }),
  ],
});
