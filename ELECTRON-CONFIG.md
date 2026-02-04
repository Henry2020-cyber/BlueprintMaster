# Guia Rapido - Configuracao Atual

## Status Atual

Seu projeto esta **quase pronto** para gerar o instalador Windows. Falta apenas uma configuracao importante.

## Problema Identificado

O arquivo `electron/main.js` esta configurado para usar `localhost:3000` em producao (linha 26), mas um executavel standalone precisa carregar os arquivos locais empacotados.

## Solucoes

### Opcao 1: App Desktop que Abre o Site (MAIS SIMPLES)

Se voce quer que o app desktop simplesmente abra seu site online:

**Vantagem:** Muito mais simples, sem necessidade de empacotar o Next.js
**Desvantagem:** Requer internet para funcionar

**Configuracao:**
```javascript
// Em electron/main.js linha 26, altere para:
const prodUrl = 'https://seu-site-blueprintmaster.vercel.app';
```

Depois rode:
```powershell
.\build-and-package.ps1
```

### Opcao 2: App Desktop Standalone (MAIS COMPLEXO)

Se voce quer um app que funcione offline com todos os arquivos empacotados:

**Vantagem:** Funciona offline
**Desvantagem:** Requer configuracao adicional do Next.js para exportacao estatica

**Passos necessarios:**
1. Configurar Next.js para exportacao estatica
2. Modificar electron/main.js para carregar arquivos locais
3. Ajustar package.json para copiar build do Next.js

## Recomendacao

Para a maioria dos casos, a **Opcao 1** e suficiente e muito mais simples.

Se seu site ja esta no ar (Vercel, etc), basta:

1. Atualizar `electron/main.js` linha 26 com a URL do site
2. Rodar `.\build-and-package.ps1`
3. Distribuir o instalador

O app desktop sera basicamente um navegador customizado que abre seu site.

## Proximos Passos

Escolha qual opcao voce prefere e me avise para eu implementar!
