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
  win.setMenu(null);
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  if (!isQuiting) {
    win.on('close', (event) => {
      event.preventDefault();
      win.hide()
    })
  }

  // Sets up the system tray for windows computers
  // Mac version application does not require a system tray
  // as they have the dock.
  let tray = new Tray(__dirname + '/favicon.ico');
  tray.setTitle('DeProc')
  tray.on('double-click', () => {
    win.show();
  })
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
        win.destroy();
        return null;
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("To-do List");
  tray.displayBalloon({
    title: 'DeProc To-do List',
    content: 'Take a look at what you got today!'
  });
  win.tray = tray
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Sets auto starting feature
if (process.platform === 'darwin') {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
    path: process.execPath
  })
}
else {
  app.setLoginItemSettings({
    openAtLogin: true,
    path: path.resolve(path.dirname(process.execPath), "..", "Update.exe"),
    args: [
      "--processStart",
      `"${path.basename(process.execPath)}"`,
      "--process-start-args",
      `"--hidden"`
    ]
  })
}