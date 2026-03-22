import { CreateTaskDTO } from '@/models/Task.model';
import { apiClient, apiStreamClient } from './apiClient';

export const taskService = {
  getTasks: (date: string) => 
    apiClient(`/tasks?date=${date}`, { method: 'GET' }),

  createTask: (taskData: CreateTaskDTO) => 
    apiClient('/tasks', { method: 'POST', body: JSON.stringify(taskData) }),

  updateTask: (id: string,taskData: CreateTaskDTO) => 
    apiClient(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(taskData) }),

  deleteTask: (id: string) => 
    apiClient(`/tasks/${id}`, { method: 'DELETE' }),
    
  getAISummary: (date: string) => 
    apiStreamClient(`/tasks/summary?date=${date}`, { method: 'GET' }),
};