import {
  isStandardTask,
  isRecurringTask,
  isSubtaskTask,
  Task,
  TaskPriority,
} from '../index';

describe('Type Guards', () => {
  const standardTask: Task = {
    id: '1',
    title: 'Tarefa padrão',
    priority: TaskPriority.MEDIUM,
    type: 'standard',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const recurringTask: Task = {
    id: '2',
    title: 'Tarefa recorrente',
    priority: TaskPriority.LOW,
    type: 'recurring',
    status: 'pending',
    recurrence: {
      pattern: 'daily',
      interval: 1,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const subtaskTask: Task = {
    id: '3',
    title: 'Subtarefa',
    priority: TaskPriority.MEDIUM,
    type: 'subtask',
    status: 'pending',
    parentTaskId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('isStandardTask', () => {
    it('deve retornar true para tarefa padrão', () => {
      expect(isStandardTask(standardTask)).toBe(true);
    });

    it('deve retornar false para outros tipos', () => {
      expect(isStandardTask(recurringTask)).toBe(false);
      expect(isStandardTask(subtaskTask)).toBe(false);
    });
  });

  describe('isRecurringTask', () => {
    it('deve retornar true para tarefa recorrente', () => {
      expect(isRecurringTask(recurringTask)).toBe(true);
    });

    it('deve retornar false para outros tipos', () => {
      expect(isRecurringTask(standardTask)).toBe(false);
      expect(isRecurringTask(subtaskTask)).toBe(false);
    });
  });

  describe('isSubtaskTask', () => {
    it('deve retornar true para subtarefa', () => {
      expect(isSubtaskTask(subtaskTask)).toBe(true);
    });

    it('deve retornar false para outros tipos', () => {
      expect(isSubtaskTask(standardTask)).toBe(false);
      expect(isSubtaskTask(recurringTask)).toBe(false);
    });
  });
});

