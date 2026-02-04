const pngToIco = require('png-to-ico');
const fs = require('fs');

pngToIco('public/win-icon.png')
    .then(buf => {
        fs.writeFileSync('public/icon.ico', buf);
        console.log('✓ Ícone ICO criado com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao criar ícone:', err);
        process.exit(1);
    });
