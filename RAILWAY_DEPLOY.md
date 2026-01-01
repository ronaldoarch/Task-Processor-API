# 🚂 Guia de Deploy no Railway

Este guia explica como fazer deploy deste projeto no Railway.

## 📋 Pré-requisitos

1. Conta no [Railway](https://railway.app)
2. Repositório no GitHub (já configurado ✅)

## 🚀 Passo a Passo

### Opção 1: Deploy via GitHub (Recomendado)

1. **Acesse Railway:**
   - Vá para [railway.app](https://railway.app)
   - Faça login com sua conta GitHub

2. **Criar Novo Projeto:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório: `ronaldoarch/Task-Processor-API`

3. **Configuração Automática:**
   - O Railway detectará automaticamente que é um projeto Node.js
   - O build será executado automaticamente (`npm run build`)
   - O servidor iniciará com `npm start`

4. **Variáveis de Ambiente (Opcional):**
   - Railway define automaticamente a variável `PORT`
   - Não é necessário configurar nada adicional

5. **Aguardar Deploy:**
   - O Railway compilará o projeto
   - O servidor será iniciado automaticamente
   - Você receberá uma URL pública (ex: `seu-projeto.up.railway.app`)

### Opção 2: Deploy via CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar projeto
railway init

# Fazer deploy
railway up
```

## ⚙️ Configurações do Railway

### Build Command
```
npm run build
```

### Start Command
```
npm start
```

### Port
O Railway define automaticamente a variável `PORT`. O servidor já está configurado para usar:
```typescript
const PORT = process.env.PORT || 3000;
```

## 📝 Arquivos de Configuração

O projeto já inclui:

- ✅ `railway.json` - Configuração do Railway
- ✅ `Procfile` - Comando de start
- ✅ `package.json` - Scripts de build e start
- ✅ `.gitignore` - Arquivos ignorados

## 🔍 Verificação Pós-Deploy

Após o deploy, verifique:

1. **API funcionando:**
   ```
   https://seu-projeto.up.railway.app/api/statistics
   ```

2. **Interface web:**
   ```
   https://seu-projeto.up.railway.app
   ```

3. **Logs:**
   - Acesse a aba "Logs" no Railway
   - Verifique se há erros

## 🐛 Troubleshooting

### Build falha
- Verifique os logs no Railway
- Certifique-se de que todas as dependências estão no `package.json`

### Servidor não inicia
- Verifique se a porta está sendo lida de `process.env.PORT`
- Confira os logs de erro

### Página em branco
- Verifique se o front-end foi compilado (`public/app.js` existe)
- Confira o console do navegador (F12)

## 📊 Monitoramento

O Railway oferece:
- ✅ Logs em tempo real
- ✅ Métricas de uso
- ✅ Deploy automático a cada push
- ✅ Rollback fácil

## 🔄 Deploy Contínuo

Após configurar uma vez:
- Cada push no GitHub fará deploy automático
- Você receberá notificações de sucesso/falha
- Pode fazer rollback facilmente

## 💡 Dicas

1. **Domínio Customizado:**
   - Railway permite adicionar domínio customizado
   - Configure DNS apontando para o Railway

2. **Variáveis de Ambiente:**
   - Use para configurações sensíveis
   - Acesse: Settings > Variables

3. **Logs:**
   - Monitore logs para debug
   - Railway mantém histórico

## 🎉 Pronto!

Seu projeto estará online e acessível publicamente!

**Exemplo de URL:** `https://task-processor-api-production.up.railway.app`

---

**Precisa de ajuda?** Consulte a [documentação do Railway](https://docs.railway.app)

