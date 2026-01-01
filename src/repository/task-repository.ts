import { Task, TaskFilter, TaskSort, PaginationOptions, PaginatedResult } from '../types';
import { IdGenerator } from '../utils/id-generator';

/**
 * Repositório de tarefas usando padrão Repository
 * Demonstra separação de responsabilidades e inversão de dependência
 */
export interface ITaskRepository {
  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task;
  findById(id: string): Task | undefined;
  findAll(): Task[];
  update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | undefined;
  delete(id: string): boolean;
  findByFilter(filter: TaskFilter, sort?: TaskSort): Task[];
  findPaginated(
    filter: TaskFilter,
    pagination: PaginationOptions,
    sort?: TaskSort
  ): PaginatedResult<Task>;
}

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map();

  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const now = new Date();
    const newTask: Task = {
      ...task,
      id: IdGenerator.generate(),
      createdAt: now,
      updatedAt: now,
    } as Task;

    this.tasks.set(newTask.id, newTask);
    return newTask;
  }

  findById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  findAll(): Task[] {
    return Array.from(this.tasks.values());
  }

  update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | undefined {
    const task = this.tasks.get(id);
    if (!task) {
      return undefined;
    }

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    } as Task;

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  delete(id: string): boolean {
    return this.tasks.delete(id);
  }

  findByFilter(filter: TaskFilter, sort?: TaskSort): Task[] {
    let results = Array.from(this.tasks.values());

    // Filtro por status
    if (filter.status) {
      const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
      results = results.filter((task) => statuses.includes(task.status));
    }

    // Filtro por prioridade
    if (filter.priority) {
      const priorities = Array.isArray(filter.priority)
        ? filter.priority
        : [filter.priority];
      results = results.filter((task) => priorities.includes(task.priority));
    }

    // Filtro por tipo
    if (filter.type) {
      const types = Array.isArray(filter.type) ? filter.type : [filter.type];
      results = results.filter((task) => types.includes(task.type));
    }

    // Filtro por busca textual
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      results = results.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por intervalo de data
    if (filter.dueDateRange) {
      results = results.filter((task) => {
        if (task.type === 'standard' && task.dueDate) {
          const dueDate = task.dueDate.getTime();
          const start = filter.dueDateRange?.start?.getTime() ?? 0;
          const end = filter.dueDateRange?.end?.getTime() ?? Number.MAX_SAFE_INTEGER;
          return dueDate >= start && dueDate <= end;
        }
        return false;
      });
    }

    // Ordenação
    if (sort) {
      results = this.sortTasks(results, sort);
    }

    return results;
  }

  findPaginated(
    filter: TaskFilter,
    pagination: PaginationOptions,
    sort?: TaskSort
  ): PaginatedResult<Task> {
    const filtered = this.findByFilter(filter, sort);
    const total = filtered.length;
    const totalPages = Math.ceil(total / pagination.limit);
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    const data = filtered.slice(start, end);

    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  }

  private sortTasks(tasks: Task[], sort: TaskSort): Task[] {
    const sorted = [...tasks];
    const multiplier = sort.order === 'asc' ? 1 : -1;

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updatedAt':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return -1 * multiplier;
      if (aValue > bValue) return 1 * multiplier;
      return 0;
    });

    return sorted;
  }
}

