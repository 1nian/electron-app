// 生产环境插件
import type { Plugin } from 'vite'
import fs from 'node:fs'
import * as electronBuilder from 'electron-builder'
import path from 'path'

const build = () => {
    require('esbuild').buildSync({
        entryPoints: ['src/electron-main.ts'],
        bundle: true,
        outfile: 'dist/electron-main.js',
        platform: 'node',
        external: ['electron']
    })
}

export const ElectronBuildPlugin = (): Plugin => {
    return {
        name: 'electron-build',
        closeBundle() {
            build()
            const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
            json.main = 'electron-main.js'
            fs.writeFileSync('dist/package.json', JSON.stringify(json, null, 4))
            // 预防 electron-builder Bug
            fs.mkdirSync('dist/node_modules')

            electronBuilder.build({
                config: {
                    directories: {
                        output: path.resolve(process.cwd(), 'release'),
                        app: path.resolve(process.cwd(), 'dist')
                    },
                    asar: true,
                    appId: 'electron-app',
                    productName: 'electron-app',
                    nsis: {
                        oneClick: false,
                        allowToChangeInstallationDirectory: true
                    }
                }
            })
        }
    }
}
