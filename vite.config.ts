import fs from 'fs';
import path from 'path';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { type Plugin, defineConfig, type LibraryFormats } from 'vite';

// Custom plugin to embed CSS string into the JS bundle for iframe injection
function cssEmbedPlugin(): Plugin {
  let cssContent = '';

  return {
    name: 'css-embed-plugin',
    enforce: 'post',
    generateBundle(_, bundle) {
      // Find and capture CSS content
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && asset.type === 'asset') {
          cssContent = asset.source as string;
          break;
        }
      }

      // Inject CSS string into all JS bundles
      if (cssContent) {
        for (const [fileName, chunk] of Object.entries(bundle)) {
          if (chunk.type === 'chunk' && fileName.match(/\.(js|cjs)$/)) {
            // Add CSS initialization code at the beginning of the bundle
            const cssInit = `(function(){if(typeof window!=="undefined"){window.__KYC_SDK_CSS__=${JSON.stringify(cssContent)};}})();`;
            chunk.code = cssInit + chunk.code;
          }
        }
      }
    },
    writeBundle(options) {
      if (!cssContent || !options.dir) return;

      // Write a JS module that exports the CSS string (for direct imports)
      const cssModulePath = path.join(options.dir, 'css-string.js');
      const cssModuleContent = `export const CSS_STRING = ${JSON.stringify(cssContent)};`;
      fs.writeFileSync(cssModulePath, cssModuleContent);
    },
  };
}

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [
      react(),
      tailwindcss(),
      !isDev &&
        dts({
          include: ['src'],
          exclude: [
            'src/main.tsx',
            'src/Widget.tsx',
            'src/Widget.css',
            'src/playground.tsx',
            'src/playground/**/*',
            'src/**/*.test.ts',
            'src/**/*.test.tsx',
          ],
          tsconfigPath: './tsconfig.build.json',
          entryRoot: 'src',
          insertTypesEntry: true,
        }),
      !isDev && cssEmbedPlugin(),
    ].filter(Boolean),
    build: isDev
      ? undefined
      : {
          outDir: 'dist',
          sourcemap: true,
          minify: 'esbuild' as const,
          lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'KYC_SDK',
            formats: ['es', 'cjs', 'iife'] as LibraryFormats[],
            fileName: (format) => {
              if (format === 'iife') return 'index.iife.js';
              if (format === 'cjs') return 'index.cjs';
              return 'index.js';
            },
          },
          rollupOptions: {
            external: [], // Bundle everything
            output: {
              exports: 'named' as const,
              globals: {}, // No external globals
              assetFileNames: (assetInfo) => {
                if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'index.css';
                return assetInfo.name || 'assets/[name][extname]';
              },
            },
          },
          cssCodeSplit: false,
        },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env': JSON.stringify({}),
    },
  };
});
