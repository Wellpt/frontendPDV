const { app, BrowserWindow } = require('electron');
const path = require('path');
const axios = require('axios');

async function waitForReact() {
    const maxRetries = 10;  // Número máximo de tentativas
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            // Tenta acessar o localhost:3001
            await axios.get('http://localhost:3001');
            console.log('React is running, starting Electron...');
            return true;  // React está pronto
        } catch (error) {
            attempt++;
            console.log(`React not ready, retrying (${attempt}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 2000));  // Aguarda 2 segundos antes de tentar novamente
        }
    }

    console.log('React não pôde ser carregado após várias tentativas.');
    return false;
}

async function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    console.log('Waiting for React to be ready...');
    const reactIsReady = await waitForReact();

    if (reactIsReady) {
        const isDev = !app.isPackaged;
        const urlToLoad = isDev
            ? 'http://localhost:3001'
            : `file://${path.join(__dirname, 'build', 'index.html')}`;

        console.log(`Loading URL: ${urlToLoad}`);
        mainWindow.loadURL(urlToLoad);
    } else {
        console.log('Failed to load React.');
    }

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
