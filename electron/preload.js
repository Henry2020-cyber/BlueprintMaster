const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Add safe APIs here if needed
    platform: process.platform
});
