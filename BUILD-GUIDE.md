# Como Gerar o Instalador Windows

## Opcao 1: Build para Desenvolvimento/Teste Local

Se voce quer testar o instalador localmente (abrira localhost:3000):

```powershell
.\build-and-package.ps1
```

**Nota:** Voce precisara ter o servidor rodando (`npm run dev`) para o app funcionar.

---

## Opcao 2: Build para Producao (Recomendado)

Se voce ja tem o site deployado online (Vercel, Netlify, etc):

### Passo 1: Definir a URL de Producao

```powershell
$env:BLUEPRINTMASTER_PROD_URL="https://seu-site.vercel.app"
```

### Passo 2: Executar o Build

```powershell
.\build-and-package.ps1
```

### Exemplo Completo:

```powershell
# Definir URL
$env:BLUEPRINTMASTER_PROD_URL="https://blueprintmaster.vercel.app"

# Fazer build
.\build-and-package.ps1
```

---

## Opcao 3: URL Permanente no Codigo

Se voce quer que a URL fique permanente no codigo:

### Edite `electron/main.js` linha 28:

```javascript
// Antes:
const prodUrl = process.env.BLUEPRINTMASTER_PROD_URL || 'http://localhost:3000';

// Depois:
const prodUrl = process.env.BLUEPRINTMASTER_PROD_URL || 'https://seu-site.vercel.app';
```

Depois rode:
```powershell
.\build-and-package.ps1
```

---

## Verificar se Funcionou

Apos gerar o instalador:

1. Instale o `BlueprintMaster-Setup.exe`
2. Abra o app
3. Verifique no console (se aparecer) qual URL foi carregada
4. O app deve abrir seu site

---

## Troubleshooting

### "Nao consigo acessar o site"

- Verifique se a URL esta correta
- Verifique se o site esta online
- Tente abrir a URL no navegador primeiro

### "Build falha"

Execute manualmente:
```powershell
# 1. Build do Next.js
npm run build

# 2. Build do Electron
npm run electron-dist

# 3. Copiar arquivos
Copy-Item dist-release/BlueprintMaster-Setup.exe public/
Compress-Archive -Path dist-release/BlueprintMaster-Setup.exe -DestinationPath public/BlueprintMaster-Setup.zip -Force
```

### "Instalador muito grande"

Isso e normal. O Electron empacota o Chromium inteiro (~200MB).

---

## Proximos Passos

1. **Deploy seu site** (se ainda nao fez)
   - Vercel: `vercel deploy --prod`
   - Ou use sua plataforma preferida

2. **Anote a URL de producao**

3. **Gere o instalador** com a URL correta

4. **Teste localmente** antes de distribuir

5. **Distribua** o arquivo ZIP (recomendado)
