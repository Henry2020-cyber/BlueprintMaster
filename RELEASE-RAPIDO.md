# 🚀 Como Fazer Release - Guia Rápido

## ⚡ Método Rápido (Tudo em 1 Comando)

```powershell
# 1. Abra PowerShell como ADMINISTRADOR
# 2. Execute:
cd D:\BlueprintMaster
.\build-and-release.ps1 -Version "v1.0.0" -Message "Primeira versão estável"
```

Pronto! Isso faz TUDO automaticamente:
- ✅ Build do Next.js
- ✅ Build do Electron  
- ✅ Cria os arquivos .exe e .zip
- ✅ Faz upload para GitHub Releases
- ✅ Gera URLs de download

## 📋 Pré-requisito (Fazer 1 Vez)

### Instalar GitHub CLI

```powershell
winget install --id GitHub.cli
```

### Fazer Login

```powershell
gh auth login
```

Escolha:
1. GitHub.com
2. HTTPS
3. Login with a web browser
4. Cole o código no navegador

## 🎯 Exemplos de Uso

### Primeira Release
```powershell
.\build-and-release.ps1 -Version "v1.0.0" -Message "Lançamento inicial do BlueprintMaster"
```

### Correção de Bug
```powershell
.\build-and-release.ps1 -Version "v1.0.1" -Message "Correção de bugs na tela de login"
```

### Nova Funcionalidade
```powershell
.\build-and-release.ps1 -Version "v1.1.0" -Message "Adicionado modo escuro e novos templates"
```

## 📦 Depois da Release

### Fazer Commit
```powershell
git add .
git commit -m "chore: release v1.0.0"
git push
```

### Testar Download
1. Acesse: https://seu-site.com/download
2. Clique em "Download .EXE"
3. Deve baixar do GitHub automaticamente

## 🔗 URLs Geradas

Após a release, você terá:

```
# Página da release
https://github.com/Henry2020-cyber/BlueprintMaster/releases/tag/v1.0.0

# Download direto do EXE
https://github.com/Henry2020-cyber/BlueprintMaster/releases/download/v1.0.0/BlueprintMaster-Setup.exe

# Download direto do ZIP  
https://github.com/Henry2020-cyber/BlueprintMaster/releases/download/v1.0.0/BlueprintMaster-Setup.zip

# Sempre a última versão (latest)
https://github.com/Henry2020-cyber/BlueprintMaster/releases/latest/download/BlueprintMaster-Setup.exe
```

## ❓ Problemas Comuns

### "Não é administrador"
→ Clique com botão direito no PowerShell → "Executar como Administrador"

### "gh: command not found"
→ Instale: `winget install --id GitHub.cli`

### "not authenticated"  
→ Execute: `gh auth login`

### "release already exists"
→ Use uma nova versão: `v1.0.1`, `v1.0.2`, etc.

## 📚 Documentação Completa

Para mais detalhes, veja: `GUIA-RELEASE.md`
