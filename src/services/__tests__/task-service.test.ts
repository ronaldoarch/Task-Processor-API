import { TaskService } from '../task-service';
import { InMemoryTaskRepository } from '../../repository/task-repository';
import { TaskPriority } from '../../types';

describe('TaskService', () => {
  let taskService: TaskService;
  let repository: InMemoryTaskRepository;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    taskService = new TaskService(repository);
  });

  describe('createTask', () => {
    it('deve criar uma tarefa padrão com sucesso', () => {
      const result = taskService.createTask('Nova tarefa', {
        description: 'Descrição da tarefa',
        priority: TaskPriority.HIGH,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Nova tarefa');
        expect(result.data.description).toBe('Descrição da tarefa');
        expect(result.data.priority).toBe(TaskPriority.HIGH);
        expect(result.data.status).toBe('pending');
        expect(result.data.type).toBe('standard');
        expect(result.data.id).toBeDefined();
      }
    });

    it('deve retornar erro se o título estiver vazio', () => {
      const result = taskService.createTask('');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Título é obrigatório');
      }
    });

    it('deve retornar erro se o título for muito longo', () => {
      const longTitle = 'a'.repeat(201);
      const result = taskService.createTask(longTitle);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Título não pode ter mais de 200 caracteres');
      }
    });

    it('deve criar uma tarefa recorrente com sucesso', () => {
      const result = taskService.createTask('Tarefa recorrente', {
        type: 'recurring',
        recurrence: {
          pattern: 'daily',
          interval: 1,
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('recurring');
        if (result.data.type === 'recurring') {
          expect(result.data.recurrence.pattern).toBe('daily');
        }
      }
    });

    it('deve criar uma subtarefa com sucesso', () => {
      // Primeiro cria a tarefa pai
      const parentResult = taskService.createTask('Tarefa pai');
      expect(parentResult.success).toBe(true);

      if (parentResult.success) {
        const subtaskResult = taskService.createTask('Subtarefa', {
          type: 'subtask',
          parentTaskId: parentResult.data.id,
        });

        expect(subtaskResult.success).toBe(true);
        if (subtaskResult.success) {
          expect(subtaskResult.data.type).toBe('subtask');
        }
      }
    });

    it('deve retornar erro ao criar subtarefa sem tarefa pai', () => {
      const result = taskService.createTask('Subtarefa', {
        type: 'subtask',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Subtarefas devem ter um ID de tarefa pai');
      }
    });
  });

  describe('updateTaskStatus', () => {
    it('deve atualizar o status da tarefa com sucesso', () => {
      const createResult = taskService.createTask('Tarefa para atualizar');
      expect(createResult.success).toBe(true);

      if (createResult.success) {
        const updateResult = taskService.updateTaskStatus(
          createResult.data.id,
          'in-progress'
        );

        expect(updateResult.success).toBe(true);
        if (updateResult.success) {
          expect(updateResult.data.status).toBe('in-progress');
        }
      }
    });

    it('não deve permitir alterar status de tarefa concluída', () => {
      const createResult = taskService.createTask('Tarefa');
      expect(createResult.success).toBe(true);

      if (createResult.success) {
        taskService.completeTask(createResult.data.id);
        const updateResult = taskService.updateTaskStatus(
          createResult.data.id,
          'in-progress'
        );

        expect(updateResult.success).toBe(false);
        if (!updateResult.success) {
          expect(updateResult.error).toContain('concluída');
        }
      }
    });
  });

  describe('completeTask', () => {
    it('deve marcar tarefa como concluída', () => {
      const createResult = taskService.createTask('Tarefa para concluir');
      expect(createResult.success).toBe(true);

      if (createResult.success) {
        const completeResult = taskService.completeTask(createResult.data.id);
        expect(completeResult.success).toBe(true);
        if (completeResult.success) {
          expect(completeResult.data.status).toBe('completed');
        }
      }
    });
  });

  describe('updateTask', () => {
    it('deve atualizar propriedades da tarefa', () => {
      const createResult = taskService.createTask('Tarefa original');
      expect(createResult.success).toBe(true);

      if (createResult.success) {
        const updateResult = taskService.updateTask(createResult.data.id, {
          title: 'Tarefa atualizada',
          priority: TaskPriority.URGENT,
        });

        expect(updateResult.success).toBe(true);
        if (updateResult.success) {
          expect(updateResult.data.title).toBe('Tarefa atualizada');
          expect(updateResult.data.priority).toBe(TaskPriority.URGENT);
        }
      }
    });

    it('não deve permitir atualizar tarefa concluída', () => {
      const createResult = taskService.createTask('Tarefa');
      expect(createResult.success).toBe(true);

      if (createResult.success) {
        taskService.completeTask(createResult.data.id);
        const updateResult = taskService.updateTask(createResult.data.id, {
          title: 'Novo título',
        });

        expect(updateResult.success).toBe(false);
      }
    });
  });

  describe('deleteTask', () => {
    it('deve deletar tarefa com sucesso', () => {
      const createResult = taskService.createTask('Tarefa para deletar');
      expect(createResult.success).toBe(true);

      if (createResult.success) {
        const deleteResult = taskService.deleteTask(createResult.data.id);
        expect(deleteResult.success).toBe(true);
        if (deleteResult.success) {
          expect(deleteResult.data).toBe(true);
        }
      }
    });

    it('não deve permitir deletar tarefa com subtarefas', () => {
      const parentResult = taskService.createTask('Tarefa pai');
      expect(parentResult.success).toBe(true);

      if (parentResult.success) {
        const subtaskResult = taskService.createTask('Subtarefa', {
          type: 'subtask',
          parentTaskId: parentResult.data.id,
        });
        expect(subtaskResult.success).toBe(true);

        const deleteResult = taskService.deleteTask(parentResult.data.id);
        expect(deleteResult.success).toBe(false);
        if (!deleteResult.success) {
          expect(deleteResult.error).toContain('subtarefas');
        }
      }
    });
  });

  describe('findTasks', () => {
    beforeEach(() => {
      taskService.createTask('Tarefa alta prioridade', {
        priority: TaskPriority.HIGH,
      });
      taskService.createTask('Tarefa baixa prioridade', {
        priority: TaskPriority.LOW,
      });
      taskService.createTask('Outra tarefa alta', {
        priority: TaskPriority.HIGH,
      });
    });

    it('deve filtrar tarefas por prioridade', () => {
      const tasks = taskService.findTasks({
        priority: TaskPriority.HIGH,
      });

      expect(tasks.length).toBe(2);
      tasks.forEach((task) => {
        expect(task.priority).toBe(TaskPriority.HIGH);
      });
    });

    it('deve filtrar tarefas por múltiplas prioridades', () => {
      const tasks = taskService.findTasks({
        priority: [TaskPriority.HIGH, TaskPriority.LOW],
      });

      expect(tasks.length).toBe(3);
    });
  });

  describe('getStatistics', () => {
    beforeEach(() => {
      taskService.createTask('Tarefa 1', { priority: TaskPriority.HIGH });
      taskService.createTask('Tarefa 2', { priority: TaskPriority.MEDIUM });
      const task3 = taskService.createTask('Tarefa 3', {
        priority: TaskPriority.LOW,
      });
      if (task3.success) {
        taskService.completeTask(task3.data.id);
      }
    });

    it('deve retornar estatísticas corretas', () => {
      const stats = taskService.getStatistics();

      expect(stats.total).toBe(3);
      expect(stats.byStatus.completed).toBe(1);
      expect(stats.byStatus.pending).toBe(2);
      expect(stats.byPriority.high).toBe(1);
      expect(stats.byPriority.medium).toBe(1);
      expect(stats.byPriority.low).toBe(1);
    });
  });
});

