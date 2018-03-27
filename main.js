const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

//Set env

process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

//Listen for the app to be ready
app.on('ready', function functionName() {
  //Create new window
  mainWindow = new BrowserWindow({});
  //Load html into the window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  //Quit App when closed
  mainWindow.on('closed', function () {
    app.quit();
  });
  //Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert menu
  Menu.setApplicationMenu(mainMenu);
});

//Handle create add window
function createAddWindow() {
  //Create new window
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Shopping List Item'
  });
  //Load html into the window
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  //Garbage collection Handle
  addWindow.on('close', function() {
    addWindow = null;
  })
}

//Catch item:addWindow
ipcMain.on('item:add', function(e, item) {
  console.log(item);
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
})

const mainMenuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Add Item',
          click(){
            createAddWindow();
          }
        },
        {
          label: 'Clear Item',
          click(){
            mainWindow.webContents.send('item:clear');
          }
        },
        {
          label: 'Quit',
          accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click(){
            app.quit();
          }
        },
      ]
    },
  ]
  //If mac, add empty menu
  if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
  }

  //Add developer tools item if not in production
  if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
      label: 'Developer Tools',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
          click(item, focusedWindow){
            focusedWindow.toggleDevTools();
          }
        },
        {
          role: 'reload',
        }
      ]
    });
  }
