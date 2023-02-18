const { app, Tray, Menu, BrowserWindow, Notification } = require('electron');
const Store = require('electron-store');
const dialog = require('node-file-dialog');
const locales = require('./locales/locales');

const store = new Store();
if(store.get('init') !== true) {
    store.set({
        init: true,
        lang: 'en_US'
    });
}


const locale = locales[store.get('lang')];

app.whenReady().then(() => {

    const tray = new Tray(`${__dirname}/assets/logo.png`);

    const contextMenu = Menu.buildFromTemplate([
        { label: locale['language'], type: 'submenu', submenu: [ { label: locale['language.english'], type: 'radio' } ] },
        { type: 'separator' },
        { label: locale['share-files'], type: "normal", click: shareFiles }

    ]);

    tray.setTitle('Air Drop');
    tray.setToolTip('Air Drop\'s config');
    tray.setContextMenu(contextMenu);

});

function createWindow(windowName) {
    const windowDir = `${__dirname}/app/${windowName}`;
    const w = new BrowserWindow({
        titleBarStyle: 'hidden',
        icon: `${__dirname}/assets/logo.png`,
        resizable: true, // DEV PHASE
        webPreferences: {
            nodeIntegration: true,
            preload: `${windowDir}/preload.js`
        }
    });
    w.loadFile(`${windowDir}/index.html`);
}

function receiveFiles() {
    const notification = new Notification({ icon: '${__dirname}/assets/logo.png', title: 'Air Drop', body: 'Vous avez reçu des fichiers' });
    notification.show();
    notification.on('click', () => {
        createWindow('receive');
    });
}

function shareFiles() {
    dialog({ type: 'open-files' }).then(files => {
        console.log(files);
        createWindow('share');
    });
}