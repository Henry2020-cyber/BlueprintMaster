# Guia de Distribuição - BlueprintMaster

## 🔒 Sobre o Windows SmartScreen

Quando você distribui um aplicativo sem certificado digital pago, o Windows SmartScreen exibirá avisos de segurança. Isso é **normal** e não significa que seu aplicativo é malicioso.

### Por que isso acontece?

1. **Sem Certificado Digital**: Certificados Code Signing custam entre $200-$500/ano
2. **Reputação**: Aplicativos novos não têm histórico de downloads no Windows
3. **Proteção do Windows**: O SmartScreen protege usuários de executáveis desconhecidos

---

## ✅ Configurações Implementadas

### 1. **NSIS Installer**
- ✅ Instalador profissional em vez de executável direto
- ✅ Arquitetura x64 forçada
- ✅ Wizard de instalação com opções personalizáveis
- ✅ Atalhos automáticos na área de trabalho e menu iniciar

### 2. **Permissões Otimizadas**
- ✅ `requestedExecutionLevel: "asInvoker"` - Não pede privilégios de administrador
- ✅ `perMachine: false` - Instalação por usuário (menos invasivo)
- ✅ Reduz alertas do SmartScreen

### 3. **Download Seguro via Blob**
- ✅ Previne corrupção do executável durante download
- ✅ Garante integridade dos bytes do arquivo
- ✅ Fallback automático se o fetch falhar

---

## 📦 Como Gerar o Instalador

### Passo 1: Build do Electron
```bash
npm run electron-dist
```

### Passo 2: Localizar o Instalador
O arquivo estará em: `dist-release/BlueprintMaster-Setup.exe`

### Passo 3: Copiar para a pasta public
```bash
Copy-Item dist-release/BlueprintMaster-Setup.exe public/
```

---

## 🚀 Estratégias de Distribuição (Sem Certificado)

### **Opção 1: Distribuir via ZIP (RECOMENDADO)**

Esta é a melhor solução para evitar bloqueios do Windows:

```bash
# Criar arquivo ZIP do instalador
Compress-Archive -Path dist-release/BlueprintMaster-Setup.exe -DestinationPath public/BlueprintMaster-Setup.zip
```

**Vantagens:**
- ✅ Quando o usuário extrai o ZIP, o Windows remove as travas de "arquivo da internet"
- ✅ Menos agressivo que download direto do .exe
- ✅ Usuários confiam mais em arquivos compactados

**Atualizar a página de download:**
```tsx
// Em app/download/page.tsx
const handleDownload = async () => {
    try {
        const response = await fetch('/BlueprintMaster-Setup.zip');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "BlueprintMaster-Setup.zip";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error("Download failed:", error);
    }
};
```

### **Opção 2: Instruções Claras para Usuários**

Adicione na página de download:

```markdown
### Como instalar (Windows pode mostrar um aviso)

1. Clique em "Download para x64"
2. Se o Windows mostrar "Windows protegeu o computador":
   - Clique em "Mais informações"
   - Clique em "Executar assim mesmo"
3. Siga o assistente de instalação
```

### **Opção 3: Distribuição via Microsoft Store**

- **Custo**: $19 (taxa única)
- **Vantagens**: Sem avisos do SmartScreen, atualizações automáticas
- **Processo**: Mais demorado (revisão da Microsoft)

### **Opção 4: Construir Reputação**

Com o tempo, o SmartScreen aprende:
- Após ~1000-2000 downloads sem problemas, os avisos diminuem
- Usuários que clicam em "Executar assim mesmo" ajudam na reputação
- Pode levar 3-6 meses

---

## 🛡️ Minimizando Avisos do SmartScreen

### 1. **Metadados do Executável**
O `package.json` já está configurado com:
- `productName`: Nome profissional
- `description`: Descrição clara
- `author`: Seu nome/empresa

### 2. **Ícone Profissional**
- ✅ Já configurado: `public/win-icon.png`
- Use ícone de alta qualidade (256x256 ou maior)

### 3. **Versão Consistente**
Mantenha versionamento semântico no `package.json`:
```json
"version": "1.0.0"
```

### 4. **HTTPS no Site**
- ✅ Certifique-se que seu site usa HTTPS
- Isso aumenta a confiança do navegador

---

## 📝 Checklist de Distribuição

- [ ] Build gerado com `npm run electron-dist`
- [ ] Instalador testado localmente
- [ ] Arquivo copiado para `public/`
- [ ] (Opcional) ZIP criado para distribuição
- [ ] Página de download atualizada
- [ ] Instruções claras para usuários sobre avisos do Windows
- [ ] Site usando HTTPS

---

## 🔮 Futuro: Certificado Digital

Se você quiser eliminar completamente os avisos:

### Opções de Certificado:
1. **DigiCert** (~$474/ano) - Mais reconhecido
2. **Sectigo** (~$199/ano) - Mais acessível
3. **SSL.com** (~$249/ano) - Bom custo-benefício

### Processo:
1. Comprar certificado Code Signing
2. Adicionar ao `package.json`:
```json
"win": {
  "certificateFile": "path/to/certificate.pfx",
  "certificatePassword": "your-password"
}
```
3. Rebuild do instalador

---

## ❓ FAQ

**P: Por que o Windows bloqueia meu app?**
R: Sem certificado digital, o Windows não reconhece o fornecedor. É proteção padrão.

**P: Meu app é seguro mesmo com o aviso?**
R: Sim! O aviso é sobre *reputação*, não sobre malware detectado.

**P: Vale a pena pagar por certificado?**
R: Se você planeja distribuir comercialmente, sim. Para projetos pessoais/open-source, use a estratégia do ZIP.

**P: O erro "Este aplicativo não pode ser executado" é o mesmo que SmartScreen?**
R: Não. Esse erro geralmente indica problema de arquitetura (x86 vs x64) ou arquivo corrompido. As configurações implementadas resolvem isso.

---

## 📞 Suporte

Se usuários reportarem problemas:
1. Verifique se baixaram a versão x64
2. Peça para extrair do ZIP (se aplicável)
3. Confirme que têm Windows 10 64-bit ou superior
4. Instrua a clicar em "Mais informações" → "Executar assim mesmo"
