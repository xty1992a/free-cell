import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
const root = (_path: string) => path.resolve(__dirname, _path);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ['styled-jsx/babel']
            },
        }),

        createSvgIconsPlugin({
            // 指定 SVG图标 保存的文件夹路径
            iconDirs: [root('src/assets/icons')],
            // 指定 使用svg图标的格式
            symbolId: 'icon-[name]',
        }),
    ],
    resolve: {
        alias: {
            '@': root('src')
        }
    }
})
