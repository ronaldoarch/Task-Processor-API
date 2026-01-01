# 🚀 Guia Rápido - Como Testar o Projeto

## Opção 1: Interface Web (Recomendado) 🌐

### Passo a Passo:

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Compilar o front-end:**
   ```bash
   npm run build:client
   ```

3. **Iniciar o servidor:**
   ```bash
   npm start
   ```

4. **Abrir no navegador:**
   ```
   http://localhost:3000
   ```

5. **Testar funcionalidades:**
   - ✅ Criar novas tarefas
   - 🔍 Filtrar por status/prioridade
   - 📊 Ver estatísticas
   - 🗑️ Deletar tarefas
   - ✓ Concluir tarefas

## Opção 2: Exemplo CLI 💻

```bash
npm run dev
```

Isso executará um exemplo no terminal mostrando todas as funcionalidades.

## Opção 3: Testes 🧪

```bash
# Executar todos os testes
npm test

# Ver cobertura de código
npm run test:coverage
```

## 📸 Screenshots

Após iniciar o servidor (`npm start`), você verá:

- **Barra de estatísticas** no topo
- **Formulário de criação** na lateral esquerda
- **Filtros** para buscar tarefas
- **Lista de tarefas** com ações (concluir/deletar)

## 🎯 Dicas

- A interface é totalmente responsiva
- Todas as ações são em tempo real
- Os dados são salvos em memória (reset ao reiniciar)
- Perfeito para demonstrar em entrevistas!

## 🐛 Problemas Comuns

**Erro ao compilar front-end:**
```bash
npm run build:client
```

**Porta 3000 já em uso:**
```bash
PORT=3001 npm start
```

**Dependências não instaladas:**
```bash
npm install
```

---

**Pronto para impressionar! 🎉**

