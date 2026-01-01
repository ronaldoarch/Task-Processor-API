/**
 * Tipos avançados demonstrando recursos avançados do TypeScript
 */

// Discriminated Union para estados de tarefa
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

// Prioridade usando const assertion
export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

// Tipo base para tarefa usando readonly e branded types
export interface TaskBase {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly priority: TaskPriority;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Discriminated Union para diferentes tipos de tarefa
export interface StandardTask extends TaskBase {
  type: 'standard';
  status: TaskStatus;
  dueDate?: Date;
}

export interface RecurringTask extends TaskBase {
  type: 'recurring';
  status: TaskStatus;
  recurrence: {
    pattern: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
}

export interface SubtaskTask extends TaskBase {
  type: 'subtask';
  status: TaskStatus;
  parentTaskId: string;
}

export type Task = StandardTask | RecurringTask | SubtaskTask;

// Utility Types customizados avançados

/**
 * Torna todas as propriedades opcionais exceto as especificadas
 */
export type RequiredExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Torna todas as propriedades readonly exceto as especificadas
 */
export type Mutable<T, K extends keyof T> = Omit<T, K> & {
  -readonly [P in K]: T[P];
};

/**
 * Extrai o tipo de retorno de uma função
 */
export type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

/**
 * Cria um tipo que representa apenas as chaves de um objeto que são de um tipo específico
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Type guard para verificar se uma tarefa é do tipo especificado
 */
export function isStandardTask(task: Task): task is StandardTask {
  return task.type === 'standard';
}

export function isRecurringTask(task: Task): task is RecurringTask {
  return task.type === 'recurring';
}

export function isSubtaskTask(task: Task): task is SubtaskTask {
  return task.type === 'subtask';
}

// Tipos para filtros e queries avançadas
export type TaskFilter = {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  type?: Task['type'] | Task['type'][];
  search?: string;
  dueDateRange?: {
    start?: Date;
    end?: Date;
  };
};

export type SortField = 'createdAt' | 'updatedAt' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';

export type TaskSort = {
  field: SortField;
  order: SortOrder;
};

// Tipo para eventos do sistema
export type TaskEventType =
  | 'task.created'
  | 'task.updated'
  | 'task.deleted'
  | 'task.completed'
  | 'task.status-changed';

export interface TaskEvent {
  type: TaskEventType;
  taskId: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

// Tipo para resultados de operações (Result pattern)
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Tipo para paginação
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

