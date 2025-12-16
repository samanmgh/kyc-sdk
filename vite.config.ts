import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { type Plugin, defineConfig, type LibraryFormats } from 'vite';

// Custom plugin to copy TypeScript declaration file to dist
function copyDtsPlugin(): Plugin {
  return {
    name: 'copy-dts-plugin',
    closeBundle() {
      const srcDts = path.resolve(__dirname, 'src/index.d.ts');
      const distDts = path.resolve(__dirname, 'dist/index.d.ts');

      if (fs.existsSync(srcDts)) {
        fs.copyFileSync(srcDts, distDts);
      }
    },
  };
}

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
          // Delete the CSS file from the bundle since we're embedding it
          delete bundle[fileName];
          break;
        }
      }

      // Inject CSS string into all JS bundles
      if (cssContent) {
        for (const [fileName, chunk] of Object.entries(bundle)) {
          if (chunk.type === 'chunk' && fileName.match(/\.(js|cjs|iife\.js)$/)) {
            // Add CSS initialization code at the beginning of the bundle
            const cssInit = `(function(){if(typeof window!=="undefined"){window.__KYC_SDK_CSS__=${JSON.stringify(cssContent)};}})();`;
            chunk.code = cssInit + chunk.code;
          }
        }
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [react(), tailwindcss(), !isDev && cssEmbedPlugin(), !isDev && copyDtsPlugin()].filter(
      Boolean
    ),
    build: isDev
      ? undefined
      : {
          outDir: 'dist',
          sourcemap: true,
          minify: 'esbuild' as const,
          copyPublicDir: false, // Don't copy public folder for library builds
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
              exports: 'default' as const,
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
