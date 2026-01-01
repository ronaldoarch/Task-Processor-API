/**
 * Ponto de entrada principal do sistema
 * Demonstra uso prático de todas as funcionalidades
 */

import { TaskService } from './services/task-service';
import { InMemoryTaskRepository } from './repository/task-repository';
import { TaskPriority } from './types';

// Inicialização do sistema
const repository = new InMemoryTaskRepository();
const taskService = new TaskService(repository);

// Exemplo de uso
function demonstrateUsage() {
  console.log('🚀 Sistema de Gerenciamento de Tarefas - TypeScript Avançado\n');

  // Criar tarefas
  console.log('📝 Criando tarefas...\n');

  const task1 = taskService.createTask('Implementar autenticação', {
    description: 'Implementar sistema de autenticação JWT',
    priority: TaskPriority.HIGH,
  });

  const task2 = taskService.createTask('Revisar código', {
    description: 'Revisar pull requests pendentes',
    priority: TaskPriority.MEDIUM,
    type: 'standard',
  });

  const task3 = taskService.createTask('Reunião diária', {
    description: 'Reunião de sincronização da equipe',
    priority: TaskPriority.LOW,
    type: 'recurring',
    recurrence: {
      pattern: 'daily',
      interval: 1,
    },
  });

  if (task1.success) {
    console.log('✅ Tarefa criada:', task1.data.title);
  } else {
    console.log('❌ Erro:', task1.error);
  }

  if (task2.success) {
    console.log('✅ Tarefa criada:', task2.data.title);
    const taskId = task2.data.id;

    // Atualizar status
    const updateResult = taskService.updateTaskStatus(taskId, 'in-progress');
    if (updateResult.success) {
      console.log(`   Status atualizado para: ${updateResult.data.status}`);
    }

    // Criar subtarefa
    const subtaskResult = taskService.createTask('Revisar PR #123', {
      description: 'Revisar código do PR #123',
      priority: TaskPriority.MEDIUM,
      type: 'subtask',
      parentTaskId: taskId,
    });

    if (subtaskResult.success) {
      console.log('   ✅ Subtarefa criada:', subtaskResult.data.title);
    }
  }

  if (task3.success) {
    console.log('✅ Tarefa recorrente criada:', task3.data.title);
  }

  console.log('\n📊 Estatísticas:\n');
  const stats = taskService.getStatistics();
  console.log(`Total de tarefas: ${stats.total}`);
  console.log('Por status:', stats.byStatus);
  console.log('Por prioridade:', stats.byPriority);
  console.log('Por tipo:', stats.byType);

  console.log('\n🔍 Buscando tarefas com filtro...\n');
  const highPriorityTasks = taskService.findTasks({
    priority: TaskPriority.HIGH,
  });

  console.log(`Tarefas de alta prioridade: ${highPriorityTasks.length}`);
  highPriorityTasks.forEach((task) => {
    console.log(`  - ${task.title} (${task.status})`);
  });

  console.log('\n📄 Buscando tarefas paginadas...\n');
  const paginated = taskService.findTasksPaginated(
    {},
    { page: 1, limit: 2 },
    { field: 'createdAt', order: 'desc' }
  );

  console.log(`Página ${paginated.pagination.page} de ${paginated.pagination.totalPages}`);
  console.log(`Total: ${paginated.pagination.total}`);
  paginated.data.forEach((task) => {
    console.log(`  - ${task.title}`);
  });
}

// Executar demonstração
if (require.main === module) {
  demonstrateUsage();
}

// Exportar para uso em outros módulos
export { TaskService, InMemoryTaskRepository };
export * from './types';

