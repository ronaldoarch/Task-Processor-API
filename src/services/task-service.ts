import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskFilter,
  TaskSort,
  PaginationOptions,
  PaginatedResult,
  Result,
} from '../types';
import { ITaskRepository } from '../repository/task-repository';
import { ResultHelper } from '../utils/result';

/**
 * Serviço de tarefas demonstrando lógica de negócio e validações
 * Usa injeção de dependência através do construtor
 */
export class TaskService {
  constructor(private repository: ITaskRepository) {}

  /**
   * Cria uma nova tarefa com validações
   */
  createTask(
    title: string,
    options: {
      description?: string;
      priority?: TaskPriority;
      type?: Task['type'];
      dueDate?: Date;
      recurrence?: RecurringTask['recurrence'];
      parentTaskId?: string;
    } = {}
  ): Result<Task, string> {
    // Validações
    if (!title || title.trim().length === 0) {
      return ResultHelper.error('Título é obrigatório');
    }

    if (title.length > 200) {
      return ResultHelper.error('Título não pode ter mais de 200 caracteres');
    }

    if (options.description && options.description.length > 1000) {
      return ResultHelper.error('Descrição não pode ter mais de 1000 caracteres');
    }

    // Validação para subtarefas
    if (options.type === 'subtask' && !options.parentTaskId) {
      return ResultHelper.error('Subtarefas devem ter um ID de tarefa pai');
    }

    if (options.type === 'subtask' && options.parentTaskId) {
      const parentTask = this.repository.findById(options.parentTaskId);
      if (!parentTask) {
        return ResultHelper.error('Tarefa pai não encontrada');
      }
    }

    // Validação para tarefas recorrentes
    if (options.type === 'recurring' && !options.recurrence) {
      return ResultHelper.error('Tarefas recorrentes devem ter configuração de recorrência');
    }

    // Criação da tarefa baseada no tipo
    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: options.description?.trim(),
      priority: options.priority || TaskPriority.MEDIUM,
      status: 'pending',
      type: options.type || 'standard',
      ...(options.type === 'standard' && {
        dueDate: options.dueDate,
      }),
      ...(options.type === 'recurring' && {
        recurrence: options.recurrence!,
      }),
      ...(options.type === 'subtask' && {
        parentTaskId: options.parentTaskId!,
      }),
    } as Task;

    const task = this.repository.create(taskData);
    return ResultHelper.success(task);
  }

  /**
   * Atualiza o status de uma tarefa
   */
  updateTaskStatus(taskId: string, status: TaskStatus): Result<Task, string> {
    const task = this.repository.findById(taskId);
    if (!task) {
      return ResultHelper.error('Tarefa não encontrada');
    }

    // Validações de transição de status
    if (task.status === 'completed' && status !== 'completed') {
      return ResultHelper.error('Não é possível alterar o status de uma tarefa concluída');
    }

    if (task.status === 'cancelled' && status !== 'cancelled') {
      return ResultHelper.error('Não é possível alterar o status de uma tarefa cancelada');
    }

    const updated = this.repository.update(taskId, { status });
    if (!updated) {
      return ResultHelper.error('Erro ao atualizar tarefa');
    }

    return ResultHelper.success(updated);
  }

  /**
   * Marca uma tarefa como concluída
   */
  completeTask(taskId: string): Result<Task, string> {
    return this.updateTaskStatus(taskId, 'completed');
  }

  /**
   * Cancela uma tarefa
   */
  cancelTask(taskId: string): Result<Task, string> {
    return this.updateTaskStatus(taskId, 'cancelled');
  }

  /**
   * Atualiza uma tarefa
   */
  updateTask(
    taskId: string,
    updates: {
      title?: string;
      description?: string;
      priority?: TaskPriority;
      dueDate?: Date;
    }
  ): Result<Task, string> {
    const task = this.repository.findById(taskId);
    if (!task) {
      return ResultHelper.error('Tarefa não encontrada');
    }

    if (task.status === 'completed') {
      return ResultHelper.error('Não é possível atualizar uma tarefa concluída');
    }

    if (task.status === 'cancelled') {
      return ResultHelper.error('Não é possível atualizar uma tarefa cancelada');
    }

    // Validações
    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim().length === 0) {
        return ResultHelper.error('Título não pode ser vazio');
      }
      if (updates.title.length > 200) {
        return ResultHelper.error('Título não pode ter mais de 200 caracteres');
      }
    }

    if (updates.description !== undefined && updates.description.length > 1000) {
      return ResultHelper.error('Descrição não pode ter mais de 1000 caracteres');
    }

    const updated = this.repository.update(taskId, updates);
    if (!updated) {
      return ResultHelper.error('Erro ao atualizar tarefa');
    }

    return ResultHelper.success(updated);
  }

  /**
   * Deleta uma tarefa
   */
  deleteTask(taskId: string): Result<boolean, string> {
    const task = this.repository.findById(taskId);
    if (!task) {
      return ResultHelper.error('Tarefa não encontrada');
    }

    // Verifica se há subtarefas
    const subtasks = this.repository.findByFilter({
      type: 'subtask',
    });
    const hasSubtasks = subtasks.some(
      (t) => t.type === 'subtask' && t.parentTaskId === taskId
    );

    if (hasSubtasks) {
      return ResultHelper.error('Não é possível deletar uma tarefa com subtarefas');
    }

    const deleted = this.repository.delete(taskId);
    return deleted
      ? ResultHelper.success(true)
      : ResultHelper.error('Erro ao deletar tarefa');
  }

  /**
   * Busca tarefas com filtros
   */
  findTasks(filter: TaskFilter, sort?: TaskSort): Task[] {
    return this.repository.findByFilter(filter, sort);
  }

  /**
   * Busca tarefas paginadas
   */
  findTasksPaginated(
    filter: TaskFilter,
    pagination: PaginationOptions,
    sort?: TaskSort
  ): PaginatedResult<Task> {
    return this.repository.findPaginated(filter, pagination, sort);
  }

  /**
   * Obtém estatísticas das tarefas
   */
  getStatistics(): {
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
    byType: Record<Task['type'], number>;
  } {
    const allTasks = this.repository.findAll();

    const byStatus: Record<TaskStatus, number> = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
      cancelled: 0,
    };

    const byPriority: Record<TaskPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    const byType: Record<Task['type'], number> = {
      standard: 0,
      recurring: 0,
      subtask: 0,
    };

    allTasks.forEach((task) => {
      byStatus[task.status]++;
      byPriority[task.priority]++;
      byType[task.type]++;
    });

    return {
      total: allTasks.length,
      byStatus,
      byPriority,
      byType,
    };
  }
}

// Importação necessária para o tipo RecurringTask
import type { RecurringTask } from '../types';

