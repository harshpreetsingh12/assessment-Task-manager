import { apiClient, apiStreamClient } from './apiClient';

export const taskService = {
  getTasks: (date: string) => 
    apiClient(`/tasks?date=${date}`, { method: 'GET' }),

  createTask: (taskData: any) => 
    apiClient('/tasks', { method: 'POST', body: JSON.stringify(taskData) }),

  deleteTask: (id: string) => 
    apiClient(`/tasks/${id}`, { method: 'DELETE' }),
    
  getAISummary: (date: string) => 
    apiStreamClient(`/tasks/summary?date=${date}`, { method: 'GET' }),
};