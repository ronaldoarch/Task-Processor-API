# 📋 Instruções Rápidas

## ⚠️ IMPORTANTE: Porta 3000 Ocupada

Se você está vendo uma página diferente (como "Task Processor API"), significa que há outro servidor rodando na porta 3000.

## ✅ Solução Rápida

### Opção 1: Parar outros servidores

```bash
# Ver processos na porta 3000
lsof -ti:3000

# Parar todos os processos
kill -9 $(lsof -ti:3000)

# Iniciar nosso servidor
npm start
```

### Opção 2: Usar outra porta

```bash
# Compilar front-end
npm run build:client

# Iniciar em outra porta
PORT=3001 ts-node src/server.ts
```

Depois acesse: `http://localhost:3001`

## 🚀 Passo a Passo Completo

1. **Instalar dependências (se ainda não fez):**
   ```bash
   npm install
   ```

2. **Compilar tudo:**
   ```bash
   npm run build
   ```

3. **Verificar porta:**
   ```bash
   lsof -ti:3000
   ```
   
   Se retornar números, pare os processos:
   ```bash
   kill -9 $(lsof -ti:3000)
   ```

4. **Iniciar servidor:**
   ```bash
   npm start
   ```

5. **Abrir navegador:**
   ```
   http://localhost:3000
   ```

## 🎯 O que você deve ver:

- ✅ Título: "🚀 Sistema Avançado de Tarefas"
- ✅ Barra de estatísticas no topo
- ✅ Formulário para criar tarefas na lateral
- ✅ Lista de tarefas no centro
- ✅ Filtros e ordenação

## 🐛 Problemas?

- **Erro de compilação:** Execute `npm run build` para ver erros
- **Porta ocupada:** Use `PORT=3001 npm start`
- **Página em branco:** Verifique o console do navegador (F12)

## 📞 Verificação Rápida

```bash
# Testar API diretamente
curl http://localhost:3000/api/statistics

# Deve retornar JSON com estatísticas
```

---

**Pronto! Agora você deve ver a interface correta! 🎉**

