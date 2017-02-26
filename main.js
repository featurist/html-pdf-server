const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const fs = require('fs')

const urlToPrint = process.argv[2]
const saveToPath = process.argv[3]

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600, show: false})

  mainWindow.loadURL(urlToPrint)

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.printToPDF({}, function (err, buffer) {
      if (err) {
        console.error(err)
        process.exit(1)
      } else {
        fs.writeFile(saveToPath, buffer, (error) => {
          if (err) {
            console.error(err)
            process.exit(2)
          } else {
            process.exit(0)
          }
        })
      }
    })
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)
