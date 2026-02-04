# Build Script - Run as Administrator
# This script must be run with administrator privileges to create symbolic links

Write-Host "Verificando privilégios de administrador..." -ForegroundColor Cyan

# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERRO: Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host "Clique com o botão direito no PowerShell e selecione 'Executar como Administrador'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Privilégios de administrador confirmados!" -ForegroundColor Green
Write-Host ""

# Navigate to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Clean electron-builder cache
Write-Host "Limpando cache do electron-builder..." -ForegroundColor Yellow
if (Test-Path "$env:LOCALAPPDATA\electron-builder\Cache") {
    Remove-Item -Recurse -Force "$env:LOCALAPPDATA\electron-builder\Cache" -ErrorAction SilentlyContinue
    Write-Host "Cache limpo!" -ForegroundColor Green
}

# Clean dist-release
Write-Host "Limpando dist-release..." -ForegroundColor Yellow
if (Test-Path "dist-release") {
    Remove-Item -Recurse -Force dist-release -ErrorAction SilentlyContinue
    Write-Host "dist-release limpo!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Executando build do Electron..." -ForegroundColor Cyan
npm run electron-dist

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Build concluído com sucesso!" -ForegroundColor Green
    
    # Check for output files
    if (Test-Path "dist-release") {
        Write-Host ""
        Write-Host "Arquivos gerados:" -ForegroundColor Cyan
        Get-ChildItem "dist-release" -Filter "*.exe" | ForEach-Object {
            $size = [math]::Round($_.Length / 1MB, 2)
            Write-Host "  - $($_.Name) ($size MB)" -ForegroundColor White
        }
        Get-ChildItem "dist-release" -Filter "*.zip" | ForEach-Object {
            $size = [math]::Round($_.Length / 1MB, 2)
            Write-Host "  - $($_.Name) ($size MB)" -ForegroundColor White
        }
    }
} else {
    Write-Host ""
    Write-Host "Erro no build!" -ForegroundColor Red
    exit 1
}
