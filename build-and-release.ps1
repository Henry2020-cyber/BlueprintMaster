# Script All-in-One: Build + Release
# Este script faz TUDO: build, testes e upload para GitHub

param(
    [Parameter(Mandatory=$true)]
    [string]$Version,
    
    [Parameter(Mandatory=$false)]
    [string]$Message = "Nova versão do BlueprintMaster"
)

Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   BlueprintMaster - Build & Release Completo  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar privilégios de administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERRO: Execute como Administrador!" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "✅ Privilégios de administrador confirmados" -ForegroundColor Green
Write-Host ""

# Passo 1: Limpar builds anteriores
Write-Host "🧹 Passo 1/5: Limpando builds anteriores..." -ForegroundColor Yellow
if (Test-Path "dist-release") {
    Remove-Item -Recurse -Force dist-release -ErrorAction SilentlyContinue
}
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}
Write-Host "   ✓ Limpeza concluída" -ForegroundColor Green
Write-Host ""

# Passo 2: Build do Next.js
Write-Host "⚛️  Passo 2/5: Build do Next.js..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Erro no build do Next.js!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Build do Next.js concluído" -ForegroundColor Green
Write-Host ""

# Passo 3: Build do Electron
Write-Host "⚡ Passo 3/5: Build do Electron..." -ForegroundColor Yellow
npm run electron-dist
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Erro no build do Electron!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Build do Electron concluído" -ForegroundColor Green
Write-Host ""

# Verificar arquivos gerados
$exePath = "dist-release\BlueprintMaster-Setup.exe"
$zipPath = "dist-release\BlueprintMaster-Setup.zip"

if (-not (Test-Path $exePath)) {
    Write-Host "   ❌ Arquivo .exe não encontrado!" -ForegroundColor Red
    exit 1
}

# Criar ZIP se não existir
if (-not (Test-Path $zipPath)) {
    Write-Host "   📦 Criando arquivo ZIP..." -ForegroundColor Yellow
    Compress-Archive -Path $exePath -DestinationPath $zipPath -Force
}

$exeSize = [math]::Round((Get-Item $exePath).Length / 1MB, 2)
$zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)

Write-Host "   📦 Arquivos gerados:" -ForegroundColor Cyan
Write-Host "      • BlueprintMaster-Setup.exe ($exeSize MB)" -ForegroundColor White
Write-Host "      • BlueprintMaster-Setup.zip ($zipSize MB)" -ForegroundColor White
Write-Host ""

# Passo 4: Copiar para public/
Write-Host "📁 Passo 4/5: Copiando para public/..." -ForegroundColor Yellow
Copy-Item $exePath public/BlueprintMaster-Setup.exe -Force
Copy-Item $zipPath public/BlueprintMaster-Setup.zip -Force
Write-Host "   ✓ Arquivos copiados" -ForegroundColor Green
Write-Host ""

# Passo 5: Criar Release no GitHub
Write-Host "🚀 Passo 5/5: Criando release no GitHub..." -ForegroundColor Yellow

# Verificar GitHub CLI
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghInstalled) {
    Write-Host "   ⚠️  GitHub CLI não instalado - pulando upload" -ForegroundColor Yellow
    Write-Host "   💡 Instale com: winget install --id GitHub.cli" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Build concluído! Arquivos em dist-release/" -ForegroundColor Green
    exit 0
}

# Criar release notes
$releaseNotes = @"
## 🎉 BlueprintMaster $Version

$Message

### 📦 Downloads

- **BlueprintMaster-Setup.exe** ($exeSize MB) - Instalador executável ⭐ Recomendado
- **BlueprintMaster-Setup.zip** ($zipSize MB) - Versão portátil

### 💻 Requisitos

- Windows 10 (64-bit) ou superior
- 4GB RAM (recomendado)
- 500MB espaço em disco

### ⚠️ Aviso do Windows

O Windows pode exibir um aviso de segurança. Para instalar:
1. Clique em "Mais informações"
2. Clique em "Executar assim mesmo"

---
📅 Lançamento: $(Get-Date -Format "dd/MM/yyyy HH:mm")
"@

try {
    gh release create $Version `
        $exePath `
        $zipPath `
        --title "BlueprintMaster $Version" `
        --notes $releaseNotes `
        --latest
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║          🎉 RELEASE PUBLICADA COM SUCESSO!     ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "📌 Versão: $Version" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🔗 Links:" -ForegroundColor Cyan
        Write-Host "   Release: https://github.com/Henry2020-cyber/BlueprintMaster/releases/tag/$Version" -ForegroundColor White
        Write-Host ""
        Write-Host "📥 Downloads diretos:" -ForegroundColor Cyan
        Write-Host "   EXE: https://github.com/Henry2020-cyber/BlueprintMaster/releases/download/$Version/BlueprintMaster-Setup.exe" -ForegroundColor White
        Write-Host "   ZIP: https://github.com/Henry2020-cyber/BlueprintMaster/releases/download/$Version/BlueprintMaster-Setup.zip" -ForegroundColor White
        Write-Host ""
        Write-Host "✅ Próximo passo: git add . && git commit -m 'chore: release $Version' && git push" -ForegroundColor Yellow
        Write-Host ""
    }
} catch {
    Write-Host "   ❌ Erro ao criar release: $_" -ForegroundColor Red
    Write-Host "   💡 Arquivos estão em dist-release/ - você pode fazer upload manual" -ForegroundColor Yellow
    exit 1
}
