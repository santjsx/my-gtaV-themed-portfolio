import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        cssMinify: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                music: resolve(__dirname, 'music.html'),
                cinema: resolve(__dirname, 'cinema.html'),
            },
            output: {
                assetFileNames: "assets/[name].[hash].[ext]",
                chunkFileNames: "assets/[name].[hash].js",
                entryFileNames: "assets/[name].[hash].js",
            }
        }
    }
});
