import { app, BrowserWindow, ipcMain } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import './ipcMain';

const url = require('url')

let mainWindow: BrowserWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    center: true,
    resizable: true,
    fullscreen: false,
    fullscreenable: false,
    webPreferences: {
      // node환경처럼 사용하기
      nodeIntegration: true,
      contextIsolation: false,
      // 개발자도구
      devTools: true,
    },
  });

  const urlPath = isDev ? 'http://localhost:3000' : 
  url.format({
    pathname: path.resolve(__dirname, './index.html'),
    protocol: 'file:',
    slashes: true,
  });
  

  // production에서는 패키지 내부 리소스에 접근.
  // 개발 중에는 개발 도구에서 호스팅하는 주소에서 로드.
  mainWindow.loadURL(urlPath);

  console.log('url', isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  // if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  // }

  mainWindow.setResizable(true);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => (mainWindow = undefined!));
  mainWindow.focus();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});