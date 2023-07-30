// electron 进程文件
import { app, BrowserWindow } from 'electron'

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    // 开发环境打开控制台
    win.webContents.openDevTools()

    if (process.argv[2]) {
        // 开发环境
        win.loadURL(process.argv[2])
    } else {
        // 正式环境
        win.loadFile('index.html')
    }
})
