const path = require('path');

const { app, BrowserWindow, Tray, Menu } = require('electron');
const isDev = require('electron-is-dev');

let isQuiting = false;
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    title: 'DeProc To-do List',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : 'https://deproc-398f6.firebaseapp.com/#/'
  );
  // win.setMenu(null);
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  let tray = new Tray(__dirname + '/favicon.ico');
  tray.setTitle('DeProc')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: () => {
        win.show();
      }
    },
    {
      label: 'Quit', click: () => {
        isQuiting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("To-do List");
  tray.displayBalloon({
    title: 'DeProc To-do List',
    content: 'Take a look at what you got today!'
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.setLoginItemSettings({
  openAtLogin: true,
  path: process.execPath
})