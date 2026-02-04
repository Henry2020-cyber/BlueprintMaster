# Script para criar Release no GitHub e fazer upload dos arquivos
# Requer: GitHub CLI (gh) instalado

param(
    [Parameter(Mandatory=$false)]
    [string]$Version = "v1.0.0",
    
    [Parameter(Mandatory=$false)]
    [string]$Message = "Nova versão do BlueprintMaster",

    [Parameter(Mandatory=$false)]
    [switch]$Yes
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GitHub Release - BlueprintMaster" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o GitHub CLI está instalado
Write-Host "Verificando GitHub CLI..." -ForegroundColor Yellow
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue

if (-not $ghInstalled) {
    Write-Host "ERRO: GitHub CLI não está instalado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para instalar:" -ForegroundColor Yellow
    Write-Host "  1. Visite: https://cli.github.com/" -ForegroundColor White
    Write-Host "  2. Ou use winget: winget install --id GitHub.cli" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "GitHub CLI encontrado!" -ForegroundColor Green
Write-Host ""

# Verificar se está autenticado
Write-Host "Verificando autenticação..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Você não está autenticado no GitHub!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Execute: gh auth login" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "Autenticado com sucesso!" -ForegroundColor Green
Write-Host ""

# Verificar se os arquivos existem
$exePath = "dist-release\BlueprintMaster-Setup.exe"
# $zipPath removido

Write-Host "Verificando arquivos de build..." -ForegroundColor Yellow

if (-not (Test-Path $exePath)) {
    Write-Host "ERRO: Arquivo $exePath não encontrado!" -ForegroundColor Red
    Write-Host "Execute primeiro: .\build-as-admin.ps1" -ForegroundColor Yellow
    exit 1
}

# Zip file check removed

$exeSize = [math]::Round((Get-Item $exePath).Length / 1MB, 2)
# $zipSize removido

Write-Host "Arquivos encontrados:" -ForegroundColor Green
Write-Host "  - BlueprintMaster-Setup.exe ($exeSize MB)" -ForegroundColor White
# Zip log removido
Write-Host ""

# Confirmar com o usuário
Write-Host "Versão: $Version" -ForegroundColor Cyan
Write-Host "Mensagem: $Message" -ForegroundColor Cyan
Write-Host ""
if (-not $Yes) {
    $confirm = Read-Host "Deseja criar a release? (S/N)"

    if ($confirm -ne "S" -and $confirm -ne "s") {
        Write-Host "Operação cancelada." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "Criando release no GitHub..." -ForegroundColor Yellow

# Criar release notes
$releaseNotes = @"
## 🎉 BlueprintMaster $Version

$Message

### 📦 Downloads Disponíveis

- **BlueprintMaster-Setup.exe** ($exeSize MB) - Instalador executável (Recomendado)

### 💻 Requisitos do Sistema

- Windows 10 (64-bit) ou superior
- 4GB de RAM (recomendado)
- 500MB de espaço em disco

### ⚠️ Aviso de Segurança do Windows

O Windows pode exibir um aviso de segurança ao executar o instalador. Isso é normal para aplicativos sem certificado digital pago.

**Para instalar:**
1. Clique em "Mais informações"
2. Clique em "Executar assim mesmo"

### 🐛 Problemas Conhecidos

Se encontrar algum problema, por favor reporte em: https://github.com/Henry2020-cyber/BlueprintMaster/issues

---

**Data de lançamento:** $(Get-Date -Format "dd/MM/yyyy HH:mm")
"@

# Criar a release
try {
    Write-Host "Criando tag e release..." -ForegroundColor Yellow
    
    # Salvar notes em arquivo para evitar problemas de encoding/shell
    $notesFile = "release_notes.md"
    $releaseNotes | Out-File -FilePath $notesFile -Encoding UTF8

    gh release create $Version `
        $exePath `
        --title "BlueprintMaster $Version" `
        --notes-file $notesFile `
        --latest
    
    Remove-Item $notesFile -ErrorAction SilentlyContinue
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  Release criada com sucesso!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Versão: $Version" -ForegroundColor White
        Write-Host "Arquivos enviados:" -ForegroundColor White
        Write-Host "  - BlueprintMaster-Setup.exe ($exeSize MB)" -ForegroundColor White
        Write-Host ""
        Write-Host ""
        Write-Host "Visualize em:" -ForegroundColor Cyan
        Write-Host "  https://github.com/Henry2020-cyber/BlueprintMaster/releases/tag/$Version" -ForegroundColor White
        Write-Host ""
        Write-Host "URLs de download direto:" -ForegroundColor Cyan
        Write-Host "  EXE: https://github.com/Henry2020-cyber/BlueprintMaster/releases/download/$Version/BlueprintMaster-Setup.exe" -ForegroundColor White
        Write-Host ""
    } else {
        throw "Falha ao criar release"
    }
} catch {
    Write-Host ""
    Write-Host "ERRO ao criar release: $_" -ForegroundColor Red
    Write-Host ""
    exit 1
}
