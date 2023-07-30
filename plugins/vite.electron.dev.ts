// 开发环境插件
import type { Plugin } from 'vite'
import { AddressInfo } from 'net'
import { spawn } from 'child_process'
import fs from 'node:fs'

const build = () => {
    require('esbuild').buildSync({
        entryPoints: ['src/electron-main.ts'],
        bundle: true,
        outfile: 'dist/electron-main.js',
        platform: 'node',
        external: ['electron']
    })
}

export const ElectronDevPlugin = (): Plugin => {
    return {
        name: 'electron-dev',
        configureServer(server) {
            build()
            server.httpServer?.once('listening', () => {
                // 读取vite服务信息
                const addressInfo = server.httpServer?.address() as AddressInfo
                // 拼接ip地址
                const IP = `http://localhost:${addressInfo.port}`
                // 进程传参
                let electronProcess = spawn(require('electron'), ['dist/electron-main.js', IP])
                console.log(IP)
                fs.watchFile('src/electron-main.ts', () => {
                    electronProcess.kill()
                    build()
                    electronProcess = spawn(require('electron'), ['dist/electron-main.js', IP])
                })
            })
        }
    }
}
