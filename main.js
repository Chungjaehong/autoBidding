const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = require('electron').ipcMain;

global.sharedObj = {prop1: 0};

ipcMain.on('show-prop1', function(event) {
  console.log(global.sharedObj.prop1);
});


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const {Menu} = require('electron')

const template = [
  {
    label: '메뉴',
    submenu: [
      {
        label: '홈',
		    enabled : true,
		    click (item, menuClick) {
          mainWindow.loadURL(`file:${__dirname}/index.html`)
        } 
      },
      {
        label: '설정하기',
		    enabled : true,
		    click (item, menuClick) {
          mainWindow.loadURL(`file:${__dirname}/setting.html`)
        } 
      }
    ]
  },
  /*{
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      }
    ]
  }*/
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200
    , height: 800
    ,webSecurity: false
    })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

