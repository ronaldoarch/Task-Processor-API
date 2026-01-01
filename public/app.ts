/**
 * Aplicação front-end em TypeScript
 * Demonstra integração com a API
 */

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  type: 'standard' | 'recurring' | 'subtask';
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class TaskManager {
  private apiUrl = '/api/tasks';

  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(this.apiUrl);
      const result: ApiResponse<Task[]> = await response.json();
      return result.success ? result.data || [] : [];
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      return [];
    }
  }

  async createTask(taskData: {
    title: string;
    description?: string;
    priority: string;
    type: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const result: ApiResponse<Task> = await response.json();
      return result.success;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      return false;
    }
  }

  async updateTaskStatus(id: string, status: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result: ApiResponse<Task> = await response.json();
      return result.success;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return false;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      const result: ApiResponse<boolean> = await response.json();
      return result.success;
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      return false;
    }
  }

  async getStatistics(): Promise<any> {
    try {
      const response = await fetch('/api/statistics');
      const result: ApiResponse<any> = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  }
}

class TaskManagerUI {
  private taskManager = new TaskManager();
  private currentTasks: Task[] = [];

  constructor() {
    this.init();
  }

  private init(): void {
    this.setupEventListeners();
    this.loadTasks();
    this.loadStatistics();
  }

  private setupEventListeners(): void {
    const form = document.getElementById('taskForm') as HTMLFormElement;
    form?.addEventListener('submit', (e) => this.handleCreateTask(e));

    const filterStatus = document.getElementById('filterStatus') as HTMLSelectElement;
    const filterPriority = document.getElementById('filterPriority') as HTMLSelectElement;
    const filterSearch = document.getElementById('filterSearch') as HTMLInputElement;
    const sortField = document.getElementById('sortField') as HTMLSelectElement;
    const sortOrder = document.getElementById('sortOrder') as HTMLSelectElement;

    filterStatus?.addEventListener('change', () => this.applyFilters());
    filterPriority?.addEventListener('change', () => this.applyFilters());
    filterSearch?.addEventListener('input', () => this.applyFilters());
    sortField?.addEventListener('change', () => this.applyFilters());
    sortOrder?.addEventListener('change', () => this.applyFilters());
  }

  private async handleCreateTask(e: Event): Promise<void> {
    e.preventDefault();

    const titleInput = document.getElementById('taskTitle') as HTMLInputElement;
    const descriptionInput = document.getElementById('taskDescription') as HTMLTextAreaElement;
    const prioritySelect = document.getElementById('taskPriority') as HTMLSelectElement;
    const typeSelect = document.getElementById('taskType') as HTMLSelectElement;

    const success = await this.taskManager.createTask({
      title: titleInput.value,
      description: descriptionInput.value,
      priority: prioritySelect.value,
      type: typeSelect.value,
    });

    if (success) {
      titleInput.value = '';
      descriptionInput.value = '';
      prioritySelect.value = 'medium';
      typeSelect.value = 'standard';
      await this.loadTasks();
      await this.loadStatistics();
    } else {
      alert('Erro ao criar tarefa');
    }
  }

  private async loadTasks(): Promise<void> {
    this.currentTasks = await this.taskManager.getTasks();
    this.renderTasks();
  }

  private applyFilters(): void {
    const filterStatus = (document.getElementById('filterStatus') as HTMLSelectElement)?.value;
    const filterPriority = (document.getElementById('filterPriority') as HTMLSelectElement)?.value;
    const filterSearch = (document.getElementById('filterSearch') as HTMLInputElement)?.value.toLowerCase();

    let filtered = [...this.currentTasks];

    if (filterStatus) {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    if (filterPriority) {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    if (filterSearch) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(filterSearch) ||
          task.description?.toLowerCase().includes(filterSearch)
      );
    }

    const sortField = (document.getElementById('sortField') as HTMLSelectElement)?.value;
    const sortOrder = (document.getElementById('sortOrder') as HTMLSelectElement)?.value;

    if (sortField === 'priority') {
      const priorityOrder: Record<string, number> = {
        urgent: 4,
        high: 3,
        medium: 2,
        low: 1,
      };
      filtered.sort((a, b) => {
        const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
        return sortOrder === 'asc' ? -diff : diff;
      });
    } else if (sortField === 'title') {
      filtered.sort((a, b) => {
        const diff = a.title.localeCompare(b.title);
        return sortOrder === 'asc' ? diff : -diff;
      });
    } else {
      filtered.sort((a, b) => {
        const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? diff : -diff;
      });
    }

    this.renderTasks(filtered);
  }

  private renderTasks(tasks: Task[] = this.currentTasks): void {
    const tasksList = document.getElementById('tasksList');
    if (!tasksList) return;

    if (tasks.length === 0) {
      tasksList.innerHTML = `
        <div class="empty-state">
          <h3>📭 Nenhuma tarefa encontrada</h3>
          <p>Crie uma nova tarefa para começar!</p>
        </div>
      `;
      return;
    }

    tasksList.innerHTML = tasks
      .map(
        (task) => `
      <div class="task-item">
        <div class="task-header">
          <div>
            <div class="task-title">${this.escapeHtml(task.title)}</div>
            ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
          </div>
        </div>
        <div class="task-meta">
          <span class="badge badge-priority-${task.priority}">${this.getPriorityLabel(task.priority)}</span>
          <span class="badge badge-status">${this.getStatusLabel(task.status)}</span>
          <span style="color: var(--text-muted); font-size: 0.85rem;">
            ${new Date(task.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <div class="task-actions">
          ${task.status !== 'completed' ? `<button class="btn-small btn-success" data-action="complete" data-id="${task.id}">✓ Concluir</button>` : ''}
          <button class="btn-small btn-danger" data-action="delete" data-id="${task.id}">🗑️ Deletar</button>
        </div>
      </div>
    `
      )
      .join('');

    // Adicionar event listeners aos botões
    tasksList.querySelectorAll('[data-action="complete"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) this.completeTask(id);
      });
    });

    tasksList.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id) this.deleteTask(id);
      });
    });
  }

  private async completeTask(id: string): Promise<void> {
    const success = await this.taskManager.updateTaskStatus(id, 'completed');
    if (success) {
      await this.loadTasks();
      await this.loadStatistics();
    }
  }

  private async deleteTask(id: string): Promise<void> {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      const success = await this.taskManager.deleteTask(id);
      if (success) {
        await this.loadTasks();
        await this.loadStatistics();
      }
    }
  }

  private async loadStatistics(): Promise<void> {
    const stats = await this.taskManager.getStatistics();
    if (stats) {
      (document.getElementById('statTotal') as HTMLElement).textContent = String(stats.total);
      (document.getElementById('statPending') as HTMLElement).textContent = String(stats.byStatus.pending);
      (document.getElementById('statInProgress') as HTMLElement).textContent = String(stats.byStatus['in-progress']);
      (document.getElementById('statCompleted') as HTMLElement).textContent = String(stats.byStatus.completed);
    }
  }

  private getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente',
    };
    return labels[priority] || priority;
  }

  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      'in-progress': 'Em Progresso',
      completed: 'Concluída',
      cancelled: 'Cancelada',
    };
    return labels[status] || status;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Inicializar aplicação
const ui = new TaskManagerUI();

// Tornar disponível globalmente para os event handlers
(window as any).ui = ui;

