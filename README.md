# 🚀 Sistema Avançado de Gerenciamento de Tarefas em TypeScript

Um projeto TypeScript completo e profissional que demonstra habilidades avançadas em desenvolvimento de software, incluindo tipos avançados, padrões de design, arquitetura limpa e testes.

## ✨ Características

### TypeScript Avançado
- **Discriminated Unions** para diferentes tipos de tarefas
- **Utility Types customizados** (`RequiredExcept`, `Mutable`, `KeysOfType`)
- **Type Guards** para type narrowing seguro
- **Generics** e tipos condicionais
- **Const Assertions** para tipos literais
- **Branded Types** para garantir type safety

### Arquitetura e Padrões
- **Repository Pattern** para abstração de dados
- **Service Layer** para lógica de negócio
- **Dependency Injection** através de construtores
- **Result Pattern** para tratamento funcional de erros
- **Separação de responsabilidades** (SRP)

### Funcionalidades
- ✅ Criação de tarefas (padrão, recorrentes, subtarefas)
- ✅ Atualização e exclusão de tarefas
- ✅ Filtros avançados (status, prioridade, tipo, busca textual)
- ✅ Ordenação customizável
- ✅ Paginação
- ✅ Estatísticas e relatórios
- ✅ Validações robustas

## 📁 Estrutura do Projeto

```
src/
├── types/              # Definições de tipos avançados
│   ├── index.ts
│   └── __tests__/      # Testes de tipos
├── repository/         # Camada de acesso a dados
│   └── task-repository.ts
├── services/           # Lógica de negócio
│   ├── task-service.ts
│   └── __tests__/      # Testes de serviços
├── utils/              # Utilitários e helpers
│   ├── id-generator.ts
│   └── result.ts
├── examples/           # Exemplos de uso avançado
│   └── advanced-usage.ts
└── index.ts            # Ponto de entrada
```

## 🛠️ Tecnologias

**Backend:**
- **TypeScript 5.0+** - Tipagem estática avançada
- **Node.js + Express** - Servidor HTTP e API REST
- **Jest** - Framework de testes

**Frontend:**
- **TypeScript** - Front-end tipado
- **HTML5 + CSS3** - Interface moderna
- **Fetch API** - Comunicação com backend

**Ferramentas:**
- **ESLint** - Linter para qualidade de código
- **Prettier** - Formatação de código

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Compilar TypeScript (backend + frontend)
npm run build

# Compilar apenas front-end
npm run build:client

# Executar servidor web (com interface)
npm start

# Executar exemplo CLI
npm run dev

# Executar testes
npm test

# Executar testes com cobertura
npm run test:coverage
```

## 🌐 Interface Web

O projeto inclui uma interface web moderna para demonstrar o sistema!

### Como usar:

1. **Certifique-se de que a porta 3000 está livre:**
   ```bash
   # Verificar processos na porta 3000
   lsof -ti:3000
   
   # Se houver processos, pare-os:
   kill -9 $(lsof -ti:3000)
   ```

2. **Compilar o front-end:**
   ```bash
   npm run build:client
   ```

3. **Iniciar o servidor:**
   ```bash
   npm start
   ```
   
   Ou use o script direto:
   ```bash
   ./start-server.sh
   ```

4. **Abrir no navegador:**
   ```
   http://localhost:3000
   ```

### ⚠️ Problema com Porta Ocupada?

Se a porta 3000 estiver ocupada por outro servidor, você pode usar outra porta:

```bash
PORT=3001 npm start
```

Depois acesse: `http://localhost:3001`

### Funcionalidades da Interface:
- ✅ Criar tarefas com diferentes tipos e prioridades
- 🔍 Filtrar por status, prioridade e busca textual
- 📊 Visualizar estatísticas em tempo real
- 🎨 Interface moderna e responsiva
- 🔄 Atualização dinâmica sem recarregar página

## 💻 Uso Básico

```typescript
import { TaskService } from './services/task-service';
import { InMemoryTaskRepository } from './repository/task-repository';
import { TaskPriority } from './types';

// Inicializar serviço
const repository = new InMemoryTaskRepository();
const taskService = new TaskService(repository);

// Criar tarefa
const result = taskService.createTask('Minha tarefa', {
  description: 'Descrição da tarefa',
  priority: TaskPriority.HIGH,
});

if (result.success) {
  console.log('Tarefa criada:', result.data);
} else {
  console.error('Erro:', result.error);
}

// Buscar tarefas com filtro
const tasks = taskService.findTasks({
  priority: TaskPriority.HIGH,
  status: 'pending',
});

// Obter estatísticas
const stats = taskService.getStatistics();
console.log(stats);
```

## 🧪 Testes

O projeto inclui testes unitários completos demonstrando:
- Testes de criação de tarefas
- Testes de validação
- Testes de filtros e buscas
- Testes de type guards
- Cobertura de código

```bash
npm test
```

## 📚 Conceitos TypeScript Demonstrados

### 1. Discriminated Unions
```typescript
type Task = StandardTask | RecurringTask | SubtaskTask;
```

### 2. Utility Types Customizados
```typescript
type RequiredExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
```

### 3. Type Guards
```typescript
function isStandardTask(task: Task): task is StandardTask {
  return task.type === 'standard';
}
```

### 4. Result Pattern
```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
```

### 5. Generics Avançados
```typescript
interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationInfo;
}
```

## 🎯 Destaques para Recrutadores

Este projeto demonstra:

1. **Domínio profundo de TypeScript** - Uso de recursos avançados da linguagem
2. **Arquitetura limpa** - Separação clara de responsabilidades
3. **Padrões de design** - Repository, Service Layer, Dependency Injection
4. **Qualidade de código** - Testes, validações, tratamento de erros
5. **Boas práticas** - Type safety, imutabilidade, composição
6. **Documentação** - Código bem documentado e README completo

## 📖 Documentação Adicional

Consulte [CONCEITOS.md](./CONCEITOS.md) para uma explicação detalhada dos conceitos TypeScript avançados utilizados.

## 🎓 Aprendizado

Este projeto é ideal para:
- Estudar TypeScript avançado
- Entender padrões de design em TypeScript
- Ver exemplos de arquitetura limpa
- Aprender boas práticas de desenvolvimento

## 📝 Licença

MIT

## 👨‍💻 Autor

Projeto criado para demonstrar habilidades avançadas em TypeScript e desenvolvimento de software.

