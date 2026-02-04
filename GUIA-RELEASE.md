# 📦 Guia de Build e Release - BlueprintMaster

Este guia explica como fazer build e publicar novas versões do BlueprintMaster.

## 🔧 Pré-requisitos

### 1. GitHub CLI (gh)

Você precisa instalar o GitHub CLI para fazer upload automático:

**Opção A - Usando winget:**
```powershell
winget install --id GitHub.cli
```

**Opção B - Download manual:**
- Visite: https://cli.github.com/
- Baixe e instale o instalador para Windows

**Verificar instalação:**
```powershell
gh --version
```

### 2. Autenticar no GitHub

Após instalar, faça login:

```powershell
gh auth login
```

Siga as instruções:
1. Escolha: **GitHub.com**
2. Escolha: **HTTPS**
3. Escolha: **Login with a web browser**
4. Copie o código e cole no navegador
5. Autorize o GitHub CLI

## 🚀 Processo Completo de Build e Release

### Passo 1: Fazer o Build Local

Execute como **Administrador**:

```powershell
cd D:\BlueprintMaster
.\build-as-admin.ps1
```

Isso vai gerar:
- `dist-release/BlueprintMaster-Setup.exe`
- `dist-release/BlueprintMaster-Setup.zip`

### Passo 2: Criar Release no GitHub

Execute o script de release:

```powershell
# Versão padrão (v1.0.0)
.\release-to-github.ps1

# Ou especifique a versão e mensagem
.\release-to-github.ps1 -Version "v1.0.1" -Message "Correção de bugs e melhorias"
```

O script vai:
1. ✅ Verificar se o GitHub CLI está instalado
2. ✅ Verificar autenticação
3. ✅ Verificar se os arquivos existem
4. ✅ Criar uma tag no Git
5. ✅ Criar uma release no GitHub
6. ✅ Fazer upload dos arquivos .exe e .zip
7. ✅ Mostrar as URLs de download

### Passo 3: Commit das Alterações

Faça commit apenas das configurações (não dos binários):

```powershell
git add .
git commit -m "chore: atualização de versão v1.0.1"
git push
```

## 📋 Estrutura de Versionamento

Use versionamento semântico (SemVer):

- **v1.0.0** - Primeira versão estável
- **v1.0.1** - Correção de bugs
- **v1.1.0** - Novas funcionalidades (compatível)
- **v2.0.0** - Mudanças que quebram compatibilidade

## 🔄 Fluxo Completo (Resumo)

```powershell
# 1. Fazer build (como Admin)
.\build-as-admin.ps1

# 2. Criar release no GitHub
.\release-to-github.ps1 -Version "v1.0.1" -Message "Nova versão com melhorias"

# 3. Commit e push
git add .
git commit -m "chore: release v1.0.1"
git push
```

## 🌐 Como Funciona o Download

Após criar a release, os usuários podem baixar de duas formas:

### 1. Pela Página de Download
- Acesse: `https://seu-site.com/download`
- Clique em "Download .EXE" ou "Download .ZIP"
- O download vem direto do GitHub Releases

### 2. Diretamente do GitHub
- Acesse: `https://github.com/Henry2020-cyber/BlueprintMaster/releases`
- Escolha a versão
- Baixe os arquivos

## 📦 URLs de Download Direto

Após criar uma release, as URLs seguem este padrão:

```
# Última versão (latest)
https://github.com/Henry2020-cyber/BlueprintMaster/releases/latest/download/BlueprintMaster-Setup.exe
https://github.com/Henry2020-cyber/BlueprintMaster/releases/latest/download/BlueprintMaster-Setup.zip

# Versão específica (ex: v1.0.1)
https://github.com/Henry2020-cyber/BlueprintMaster/releases/download/v1.0.1/BlueprintMaster-Setup.exe
https://github.com/Henry2020-cyber/BlueprintMaster/releases/download/v1.0.1/BlueprintMaster-Setup.zip
```

## 🐛 Solução de Problemas

### Erro: "gh: command not found"
- Instale o GitHub CLI: `winget install --id GitHub.cli`
- Reinicie o PowerShell

### Erro: "not authenticated"
- Execute: `gh auth login`
- Siga as instruções de autenticação

### Erro: "release already exists"
- A versão já foi publicada
- Use uma nova versão: `.\release-to-github.ps1 -Version "v1.0.2"`

### Erro: "arquivo não encontrado"
- Execute primeiro: `.\build-as-admin.ps1`
- Verifique se os arquivos estão em `dist-release/`

## 📝 Notas Importantes

1. **Arquivos .exe e .zip NÃO vão para o Git**
   - Eles são ignorados pelo `.gitignore`
   - São enviados apenas para o GitHub Releases

2. **Sempre use Administrador para build**
   - Necessário para criar links simbólicos no Windows

3. **Versões devem ser únicas**
   - Não pode criar duas releases com a mesma versão
   - Use versionamento sequencial

4. **Página de download atualiza automaticamente**
   - Configurada para usar `latest` (última versão)
   - Não precisa alterar código a cada release

## 🎯 Checklist de Release

- [ ] Testei o aplicativo localmente
- [ ] Atualizei o CHANGELOG.md (se houver)
- [ ] Executei `.\build-as-admin.ps1` com sucesso
- [ ] Testei o instalador gerado
- [ ] Executei `.\release-to-github.ps1` com a versão correta
- [ ] Verifiquei a release no GitHub
- [ ] Testei o download pela página `/download`
- [ ] Fiz commit e push das alterações de código

## 📞 Suporte

Se encontrar problemas, verifique:
- GitHub Issues: https://github.com/Henry2020-cyber/BlueprintMaster/issues
- Documentação do GitHub CLI: https://cli.github.com/manual/
