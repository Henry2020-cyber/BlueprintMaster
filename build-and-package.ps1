# Script de Build e Distribuicao - BlueprintMaster
# Este script automatiza o processo de build do Electron e preparacao para distribuicao

Write-Host "Iniciando build do BlueprintMaster..." -ForegroundColor Cyan
Write-Host ""

# Passo 1: Limpar builds anteriores
Write-Host "Limpando builds anteriores..." -ForegroundColor Yellow
if (Test-Path "dist-release") {
    Remove-Item -Recurse -Force dist-release
    Write-Host "dist-release removido" -ForegroundColor Green
}

if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host ".next removido" -ForegroundColor Green
}

if (Test-Path "public/BlueprintMaster-Setup.exe") {
    Remove-Item -Force public/BlueprintMaster-Setup.exe
    Write-Host "Instalador antigo removido de public/" -ForegroundColor Green
}

if (Test-Path "public/BlueprintMaster-Setup.zip") {
    Remove-Item -Force public/BlueprintMaster-Setup.zip
    Write-Host "ZIP antigo removido de public/" -ForegroundColor Green
}

Write-Host ""

# Passo 2: Build do Next.js
Write-Host "Executando build do Next.js..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no build do Next.js!" -ForegroundColor Red
    exit 1
}

Write-Host "Build do Next.js concluido!" -ForegroundColor Green
Write-Host ""

# Passo 3: Build do Electron
Write-Host "Executando build do Electron..." -ForegroundColor Yellow
npm run electron-dist

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no build do Electron!" -ForegroundColor Red
    exit 1
}

Write-Host "Build do Electron concluido com sucesso!" -ForegroundColor Green
Write-Host ""

# Passo 4: Verificar se o instalador foi gerado
$installerPath = "dist-release/BlueprintMaster-Setup.exe"
if (-not (Test-Path $installerPath)) {
    Write-Host "Instalador nao encontrado em $installerPath" -ForegroundColor Red
    exit 1
}

$installerSize = (Get-Item $installerPath).Length / 1MB
Write-Host "Instalador gerado: $([math]::Round($installerSize, 2)) MB" -ForegroundColor Green
Write-Host ""

# Passo 5: Copiar para public/
Write-Host "Copiando instalador para public/..." -ForegroundColor Yellow
Copy-Item $installerPath public/BlueprintMaster-Setup.exe
# Passo 6: ZIP removido conforme solicitacao
Write-Host "ZIP desabilitado. Pulando etapa." -ForegroundColor Gray
Write-Host ""


# Passo 7: Resumo
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Build finalizado com sucesso!" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Arquivos gerados:" -ForegroundColor White
Write-Host "  - public/BlueprintMaster-Setup.exe ($([math]::Round($installerSize, 2)) MB)" -ForegroundColor White
Write-Host "  - public/BlueprintMaster-Setup.zip ($([math]::Round($zipSize, 2)) MB)" -ForegroundColor White
Write-Host ""
Write-Host "Recomendacao:" -ForegroundColor Yellow
Write-Host "  Distribua o arquivo .ZIP para evitar bloqueios do Windows SmartScreen" -ForegroundColor Yellow
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "  1. Teste o instalador localmente" -ForegroundColor White
Write-Host "  2. Atualize a pagina de download se necessario" -ForegroundColor White
Write-Host "  3. Faca commit e push das alteracoes" -ForegroundColor White
Write-Host ""
Write-Host "Consulte DISTRIBUICAO.md para mais informacoes" -ForegroundColor Cyan
Write-Host ""
