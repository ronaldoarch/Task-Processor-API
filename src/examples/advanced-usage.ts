/**
 * Exemplos avançados de uso do sistema
 * Demonstra recursos avançados e casos de uso complexos
 */

import { TaskService } from '../services/task-service';
import { InMemoryTaskRepository } from '../repository/task-repository';
import {
  TaskPriority,
  isStandardTask,
  isRecurringTask,
} from '../types';

/**
 * Exemplo 1: Criação de múltiplas tarefas com diferentes tipos
 */
export function exemploCriacaoMultipla() {
  const repository = new InMemoryTaskRepository();
  const service = new TaskService(repository);

  // Tarefa padrão
  const tarefa1 = service.createTask('Implementar API REST', {
    description: 'Criar endpoints para o sistema',
    priority: TaskPriority.HIGH,
    type: 'standard',
    dueDate: new Date('2024-12-31'),
  });

  // Tarefa recorrente
  const tarefa2 = service.createTask('Reunião de equipe', {
    description: 'Reunião semanal de sincronização',
    priority: TaskPriority.MEDIUM,
    type: 'recurring',
    recurrence: {
      pattern: 'weekly',
      interval: 1,
    },
  });

  if (tarefa2.success) {
    console.log('Tarefa recorrente criada:', tarefa2.data.title);
  }

  // Subtarefas
  if (tarefa1.success) {
    const subtarefa1 = service.createTask('Criar endpoint GET /users', {
      priority: TaskPriority.HIGH,
      type: 'subtask',
      parentTaskId: tarefa1.data.id,
    });

    const subtarefa2 = service.createTask('Criar endpoint POST /users', {
      priority: TaskPriority.HIGH,
      type: 'subtask',
      parentTaskId: tarefa1.data.id,
    });

    console.log('Tarefa principal:', tarefa1.data.title);
    console.log('Subtarefas criadas:', subtarefa1.success, subtarefa2.success);
  }

  return service;
}

/**
 * Exemplo 2: Filtros avançados e type narrowing
 */
export function exemploFiltrosAvancados() {
  const repository = new InMemoryTaskRepository();
  const service = new TaskService(repository);

  // Criar tarefas de exemplo
  service.createTask('Tarefa urgente 1', { priority: TaskPriority.URGENT });
  service.createTask('Tarefa urgente 2', { priority: TaskPriority.URGENT });
  service.createTask('Tarefa média', { priority: TaskPriority.MEDIUM });
  service.createTask('Tarefa baixa', { priority: TaskPriority.LOW });

  // Filtrar por múltiplas prioridades
  const tarefasImportantes = service.findTasks({
    priority: [TaskPriority.URGENT, TaskPriority.HIGH],
  });

  console.log(`Tarefas importantes: ${tarefasImportantes.length}`);

  // Filtrar e usar type guards
  const todasTarefas = service.findTasks({});
  const tarefasPadrao = todasTarefas.filter(isStandardTask);
  const tarefasRecorrentes = todasTarefas.filter(isRecurringTask);

  console.log(`Tarefas padrão: ${tarefasPadrao.length}`);
  console.log(`Tarefas recorrentes: ${tarefasRecorrentes.length}`);

  // Type narrowing seguro
  tarefasPadrao.forEach((task) => {
    // TypeScript sabe que task é StandardTask aqui
    if (task.dueDate) {
      console.log(`Tarefa ${task.title} vence em ${task.dueDate}`);
    }
  });

  return service;
}

/**
 * Exemplo 3: Paginação e ordenação
 */
export function exemploPaginacao() {
  const repository = new InMemoryTaskRepository();
  const service = new TaskService(repository);

  // Criar várias tarefas
  for (let i = 1; i <= 15; i++) {
    service.createTask(`Tarefa ${i}`, {
      priority: i % 2 === 0 ? TaskPriority.HIGH : TaskPriority.MEDIUM,
    });
  }

  // Buscar primeira página
  const pagina1 = service.findTasksPaginated(
    {},
    { page: 1, limit: 5 },
    { field: 'createdAt', order: 'desc' }
  );

  console.log('Página 1:');
  console.log(`Total: ${pagina1.pagination.total}`);
  console.log(`Páginas: ${pagina1.pagination.totalPages}`);
  console.log(`Tem próxima: ${pagina1.pagination.hasNext}`);

  pagina1.data.forEach((task) => {
    console.log(`- ${task.title}`);
  });

  // Buscar segunda página
  if (pagina1.pagination.hasNext) {
    const pagina2 = service.findTasksPaginated(
      {},
      { page: 2, limit: 5 },
      { field: 'createdAt', order: 'desc' }
    );

    console.log('\nPágina 2:');
    pagina2.data.forEach((task) => {
      console.log(`- ${task.title}`);
    });
  }

  return service;
}

/**
 * Exemplo 4: Workflow completo com tratamento de erros
 */
export function exemploWorkflowCompleto() {
  const repository = new InMemoryTaskRepository();
  const service = new TaskService(repository);

  // Criar tarefa
  const criarResult = service.createTask('Desenvolver feature X', {
    description: 'Implementar nova funcionalidade',
    priority: TaskPriority.HIGH,
  });

  if (!criarResult.success) {
    console.error('Erro ao criar:', criarResult.error);
    return;
  }

  const tarefaId = criarResult.data.id;
  console.log('✅ Tarefa criada:', criarResult.data.title);

  // Atualizar status
  const atualizarResult = service.updateTaskStatus(tarefaId, 'in-progress');
  if (atualizarResult.success) {
    console.log('✅ Status atualizado para:', atualizarResult.data.status);
  }

  // Adicionar subtarefas
  const subtarefa1 = service.createTask('Análise de requisitos', {
    type: 'subtask',
    parentTaskId: tarefaId,
    priority: TaskPriority.MEDIUM,
  });

  const subtarefa2 = service.createTask('Implementação', {
    type: 'subtask',
    parentTaskId: tarefaId,
    priority: TaskPriority.HIGH,
  });

  if (subtarefa1.success && subtarefa2.success) {
    console.log('✅ Subtarefas criadas');
  }

  // Buscar todas as subtarefas da tarefa principal
  const subtarefas = service.findTasks({
    type: 'subtask',
  });

  const subtarefasDaTarefa = subtarefas.filter(
    (t) => t.type === 'subtask' && t.parentTaskId === tarefaId
  );

  console.log(`📋 Total de subtarefas: ${subtarefasDaTarefa.length}`);

  // Completar tarefa principal
  const completarResult = service.completeTask(tarefaId);
  if (completarResult.success) {
    console.log('✅ Tarefa concluída!');
  }

  // Obter estatísticas finais
  const stats = service.getStatistics();
  console.log('\n📊 Estatísticas finais:');
  console.log(`Total: ${stats.total}`);
  console.log(`Concluídas: ${stats.byStatus.completed}`);
  console.log(`Em progresso: ${stats.byStatus['in-progress']}`);

  return service;
}

/**
 * Exemplo 5: Busca textual avançada
 */
export function exemploBuscaTexto() {
  const repository = new InMemoryTaskRepository();
  const service = new TaskService(repository);

  service.createTask('Implementar autenticação JWT', {
    description: 'Sistema de autenticação usando tokens JWT',
  });

  service.createTask('Criar dashboard de métricas', {
    description: 'Dashboard para visualizar métricas do sistema',
  });

  service.createTask('Configurar CI/CD', {
    description: 'Pipeline de integração e deploy contínuo',
  });

  // Buscar por termo
  const resultados = service.findTasks({
    search: 'autenticação',
  });

  console.log(`Resultados da busca "autenticação": ${resultados.length}`);
  resultados.forEach((task) => {
    console.log(`- ${task.title}`);
  });

  return service;
}

// Executar exemplos se executado diretamente
if (require.main === module) {
  console.log('=== Exemplo 1: Criação Múltipla ===\n');
  exemploCriacaoMultipla();

  console.log('\n=== Exemplo 2: Filtros Avançados ===\n');
  exemploFiltrosAvancados();

  console.log('\n=== Exemplo 3: Paginação ===\n');
  exemploPaginacao();

  console.log('\n=== Exemplo 4: Workflow Completo ===\n');
  exemploWorkflowCompleto();

  console.log('\n=== Exemplo 5: Busca Textual ===\n');
  exemploBuscaTexto();
}

