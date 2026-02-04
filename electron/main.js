const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "BlueprintMaster",
        show: false, // Don't show until ready-to-show
        icon: path.join(__dirname, '../public/apple-icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'default',
        autoHideMenuBar: true
    });

    // Determine what to load
    // Development: localhost
    const devUrl = 'http://localhost:3000';

    // Production: Use environment variable or default
    // IMPORTANTE: Defina BLUEPRINTMASTER_PROD_URL antes de fazer o build
    // Exemplo: $env:BLUEPRINTMASTER_PROD_URL="https://blueprintmaster.vercel.app"
    // Ou edite diretamente abaixo:
    const prodUrl = 'https://bblueprintmaster.netlify.app/';

    const startUrl = app.isPackaged ? prodUrl : (process.env.ELECTRON_START_URL || devUrl);

    console.log(`Loading URL: ${startUrl}`);
    mainWindow.loadURL(startUrl);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Open external links in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:') || url.startsWith('http:')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
