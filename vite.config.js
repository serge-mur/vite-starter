import { resolve } from 'path'
import { defineConfig } from 'vite'
import FullReload from 'vite-plugin-full-reload'
import injectHTML from 'vite-plugin-html-inject'
import viteImagemin from 'vite-plugin-imagemin'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'build')

export default defineConfig({
    root: root,
    base: './',
    build: {
        outDir: outDir,
        emptyOutDir: true,
        server: {
            watch: {
                usePolling: true,
            }
        },
        rollupOptions: {
            input: {
                main: resolve(root, 'index.html'),
                about: resolve(root, 'about.html'),
            },
            output: {
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.')[1]
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = 'img'
                    } else if (extType === 'css') {
                        extType = 'css'
                    }
                    return `${extType}/[name][extname]`
                },
                chunkFileNames: 'js/scripts.js'
            }
        }
    },
    plugins: [
        FullReload(['src/partials/**/*']),
        injectHTML(),
        viteImagemin({
            gifsicle: {
                optimizationLevel: 7,
                interlaced: false
            },
            optipng: {
                optimizationLevel: 7
            },
            mozjpeg: {
                quality: 75
            },
            pngquant: {
                quality: [0.7, 0.7],
                speed: 4
            },
            svgo: {
                plugins: [
                    {
                        name: 'removeViewBox'
                    },
                    {
                        name: 'removeEmptyAttrs',
                        active: false
                    }
                ]
            }
        }),
    ],
})