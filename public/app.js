"use strict";
/**
 * Aplicação front-end em TypeScript
 * Demonstra integração com a API
 */
class TaskManager {
    constructor() {
        this.apiUrl = '/api/tasks';
    }
    async getTasks() {
        try {
            const response = await fetch(this.apiUrl);
            const result = await response.json();
            return result.success ? result.data || [] : [];
        }
        catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            return [];
        }
    }
    async createTask(taskData) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });
            const result = await response.json();
            return result.success;
        }
        catch (error) {
            console.error('Erro ao criar tarefa:', error);
            return false;
        }
    }
    async updateTaskStatus(id, status) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const result = await response.json();
            return result.success;
        }
        catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            return false;
        }
    }
    async deleteTask(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            return result.success;
        }
        catch (error) {
            console.error('Erro ao deletar tarefa:', error);
            return false;
        }
    }
    async getStatistics() {
        try {
            const response = await fetch('/api/statistics');
            const result = await response.json();
            return result.success ? result.data : null;
        }
        catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return null;
        }
    }
}
class TaskManagerUI {
    constructor() {
        this.taskManager = new TaskManager();
        this.currentTasks = [];
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.loadTasks();
        this.loadStatistics();
    }
    setupEventListeners() {
        const form = document.getElementById('taskForm');
        form?.addEventListener('submit', (e) => this.handleCreateTask(e));
        const filterStatus = document.getElementById('filterStatus');
        const filterPriority = document.getElementById('filterPriority');
        const filterSearch = document.getElementById('filterSearch');
        const sortField = document.getElementById('sortField');
        const sortOrder = document.getElementById('sortOrder');
        filterStatus?.addEventListener('change', () => this.applyFilters());
        filterPriority?.addEventListener('change', () => this.applyFilters());
        filterSearch?.addEventListener('input', () => this.applyFilters());
        sortField?.addEventListener('change', () => this.applyFilters());
        sortOrder?.addEventListener('change', () => this.applyFilters());
    }
    async handleCreateTask(e) {
        e.preventDefault();
        const titleInput = document.getElementById('taskTitle');
        const descriptionInput = document.getElementById('taskDescription');
        const prioritySelect = document.getElementById('taskPriority');
        const typeSelect = document.getElementById('taskType');
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
        }
        else {
            alert('Erro ao criar tarefa');
        }
    }
    async loadTasks() {
        this.currentTasks = await this.taskManager.getTasks();
        this.renderTasks();
    }
    applyFilters() {
        const filterStatus = document.getElementById('filterStatus')?.value;
        const filterPriority = document.getElementById('filterPriority')?.value;
        const filterSearch = document.getElementById('filterSearch')?.value.toLowerCase();
        let filtered = [...this.currentTasks];
        if (filterStatus) {
            filtered = filtered.filter((task) => task.status === filterStatus);
        }
        if (filterPriority) {
            filtered = filtered.filter((task) => task.priority === filterPriority);
        }
        if (filterSearch) {
            filtered = filtered.filter((task) => task.title.toLowerCase().includes(filterSearch) ||
                task.description?.toLowerCase().includes(filterSearch));
        }
        const sortField = document.getElementById('sortField')?.value;
        const sortOrder = document.getElementById('sortOrder')?.value;
        if (sortField === 'priority') {
            const priorityOrder = {
                urgent: 4,
                high: 3,
                medium: 2,
                low: 1,
            };
            filtered.sort((a, b) => {
                const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
                return sortOrder === 'asc' ? -diff : diff;
            });
        }
        else if (sortField === 'title') {
            filtered.sort((a, b) => {
                const diff = a.title.localeCompare(b.title);
                return sortOrder === 'asc' ? diff : -diff;
            });
        }
        else {
            filtered.sort((a, b) => {
                const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                return sortOrder === 'asc' ? diff : -diff;
            });
        }
        this.renderTasks(filtered);
    }
    renderTasks(tasks = this.currentTasks) {
        const tasksList = document.getElementById('tasksList');
        if (!tasksList)
            return;
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
            .map((task) => `
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
    `)
            .join('');
        // Adicionar event listeners aos botões
        tasksList.querySelectorAll('[data-action="complete"]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if (id)
                    this.completeTask(id);
            });
        });
        tasksList.querySelectorAll('[data-action="delete"]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if (id)
                    this.deleteTask(id);
            });
        });
    }
    async completeTask(id) {
        const success = await this.taskManager.updateTaskStatus(id, 'completed');
        if (success) {
            await this.loadTasks();
            await this.loadStatistics();
        }
    }
    async deleteTask(id) {
        if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
            const success = await this.taskManager.deleteTask(id);
            if (success) {
                await this.loadTasks();
                await this.loadStatistics();
            }
        }
    }
    async loadStatistics() {
        const stats = await this.taskManager.getStatistics();
        if (stats) {
            document.getElementById('statTotal').textContent = String(stats.total);
            document.getElementById('statPending').textContent = String(stats.byStatus.pending);
            document.getElementById('statInProgress').textContent = String(stats.byStatus['in-progress']);
            document.getElementById('statCompleted').textContent = String(stats.byStatus.completed);
        }
    }
    getPriorityLabel(priority) {
        const labels = {
            low: 'Baixa',
            medium: 'Média',
            high: 'Alta',
            urgent: 'Urgente',
        };
        return labels[priority] || priority;
    }
    getStatusLabel(status) {
        const labels = {
            pending: 'Pendente',
            'in-progress': 'Em Progresso',
            completed: 'Concluída',
            cancelled: 'Cancelada',
        };
        return labels[status] || status;
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
// Inicializar aplicação
const ui = new TaskManagerUI();
// Tornar disponível globalmente para os event handlers
window.ui = ui;
