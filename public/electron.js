const electron = require("electron");
const path = require("path");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = require('electron');

let mainWindow;

function sendWindowMessage(targetWindow, message, payload) {
  if(typeof targetWindow === 'undefined') {
    console.log('Target window does not exist');
    return;
  }
  targetWindow.webContents.send(message, payload);
}


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  process.stdin.resume();
  mainWindow.loadFile(path.join(__dirname, "../build/index.html"));

  ipcMain.on('helloWorld', (event, arg) => {
    sendWindowMessage(mainWindow, 'message-from-worker', arg);
  });

  workerWindow = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true }
  });
  workerWindow.loadFile(path.join(__dirname, "../build/worker.html"));
}
app.on("ready", createWindow);