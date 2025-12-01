import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        dts({insertTypesEntry: true}),
        tailwindcss()
    ],
    build: {
        outDir: 'dist',
        sourcemap: true,
        minify: false,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'KYC_SDK',
            formats: ['es', 'cjs', 'iife'],
            fileName: (format) => {
                if (format === 'iife') return 'index.iife.js'
                if (format === 'cjs') return 'index.cjs'
                return 'index.js'
            }
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                exports: 'named',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        }
    }
})
