/**
 * Servidor HTTP simples para servir a interface web
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { TaskService } from './services/task-service';
import { InMemoryTaskRepository } from './repository/task-repository';
import { TaskPriority, TaskFilter, TaskSort, PaginationOptions } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (CSS, JS compilado)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Inicializar serviço
const repository = new InMemoryTaskRepository();
const taskService = new TaskService(repository);

// Criar algumas tarefas de exemplo
taskService.createTask('Bem-vindo ao Sistema de Tarefas', {
  description: 'Este é um exemplo de tarefa criada automaticamente',
  priority: TaskPriority.HIGH,
});

taskService.createTask('Explorar funcionalidades', {
  description: 'Teste criar, editar e deletar tarefas',
  priority: TaskPriority.MEDIUM,
});

// API Routes

// GET /api/tasks - Listar tarefas
app.get('/api/tasks', (req, res) => {
  try {
    const filter: TaskFilter = {
      status: req.query.status as any,
      priority: req.query.priority as any,
      type: req.query.type as any,
      search: req.query.search as string,
    };

    const sort: TaskSort | undefined = req.query.sortField
      ? {
          field: req.query.sortField as any,
          order: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        }
      : undefined;

    const tasks = taskService.findTasks(filter, sort);
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// GET /api/tasks/paginated - Listar tarefas paginadas
app.get('/api/tasks/paginated', (req, res) => {
  try {
    const filter: TaskFilter = {
      status: req.query.status as any,
      priority: req.query.priority as any,
      type: req.query.type as any,
      search: req.query.search as string,
    };

    const pagination: PaginationOptions = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const sort: TaskSort | undefined = req.query.sortField
      ? {
          field: req.query.sortField as any,
          order: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        }
      : undefined;

    const result = taskService.findTasksPaginated(filter, pagination, sort);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// POST /api/tasks - Criar tarefa
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, priority, type, dueDate, recurrence, parentTaskId } =
      req.body;

    const result = taskService.createTask(title, {
      description,
      priority,
      type,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      recurrence,
      parentTaskId,
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// PATCH /api/tasks/:id - Atualizar tarefa
app.patch('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, status } = req.body;

    let result;

    if (status) {
      result = taskService.updateTaskStatus(id, status);
    } else {
      result = taskService.updateTask(id, {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
    }

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// DELETE /api/tasks/:id - Deletar tarefa
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = taskService.deleteTask(id);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// GET /api/tasks/:id - Obter tarefa por ID
app.get('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const task = repository.findById(id);

    if (task) {
      res.json({ success: true, data: task });
    } else {
      res.status(404).json({ success: false, error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// GET /api/statistics - Obter estatísticas
app.get('/api/statistics', (_req, res) => {
  try {
    const stats = taskService.getStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Servir index.html para todas as rotas não-API (deve ser a última rota)
app.get('*', (req, res) => {
  // Ignorar rotas de API
  if (req.path.startsWith('/api')) {
    res.status(404).json({ success: false, error: 'Not found' });
    return;
  }
  // Servir index.html para todas as outras rotas
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📱 Abra seu navegador e acesse: http://localhost:${PORT}`);
});

