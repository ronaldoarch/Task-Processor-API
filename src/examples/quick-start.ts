/**
 * Quick Start - Exemplo rápido para começar a usar o sistema
 */

import { TaskService } from '../services/task-service';
import { InMemoryTaskRepository } from '../repository/task-repository';
import { TaskPriority } from '../types';

// Inicializar
const repository = new InMemoryTaskRepository();
const taskService = new TaskService(repository);

// Criar algumas tarefas
console.log('🚀 Criando tarefas...\n');

const tarefa1 = taskService.createTask('Aprender TypeScript avançado', {
  description: 'Estudar tipos avançados, generics e padrões',
  priority: TaskPriority.HIGH,
});

const tarefa2 = taskService.createTask('Implementar testes', {
  description: 'Escrever testes unitários para o projeto',
  priority: TaskPriority.MEDIUM,
});

const tarefa3 = taskService.createTask('Revisar código', {
  priority: TaskPriority.LOW,
});

// Verificar resultados
if (tarefa1.success) {
  console.log('✅', tarefa1.data.title);
  console.log('   Prioridade:', tarefa1.data.priority);
  console.log('   Status:', tarefa1.data.status);
}

if (tarefa2.success) {
  console.log('✅', tarefa2.data.title);
  
  // Atualizar status
  const atualizar = taskService.updateTaskStatus(tarefa2.data.id, 'in-progress');
  if (atualizar.success) {
    console.log('   Status atualizado para:', atualizar.data.status);
  }
}

if (tarefa3.success) {
  console.log('✅', tarefa3.data.title);
  
  // Completar tarefa
  const completar = taskService.completeTask(tarefa3.data.id);
  if (completar.success) {
    console.log('   ✅ Tarefa concluída!');
  }
}

// Estatísticas
console.log('\n📊 Estatísticas:');
const stats = taskService.getStatistics();
console.log(`Total de tarefas: ${stats.total}`);
console.log(`Por status:`, stats.byStatus);
console.log(`Por prioridade:`, stats.byPriority);

// Buscar tarefas de alta prioridade
console.log('\n🔍 Tarefas de alta prioridade:');
const tarefasAltas = taskService.findTasks({
  priority: TaskPriority.HIGH,
});

tarefasAltas.forEach((task) => {
  console.log(`  - ${task.title} (${task.status})`);
});

console.log('\n✨ Sistema funcionando perfeitamente!');

