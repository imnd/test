import { useApi } from './useApi';
import type { Task } from '~/types';

export const useTaskActions = () => {
  const api = useApi();

  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      await api.fetch(`/tasks/${id}`, { method: 'DELETE' });
      return true;
    } catch (e: unknown) {
      const err = e as { response?: { status: number } };
      if (err.response?.status === 403) {
        alert('У вас нет прав для удаления этой задачи.');
      } else {
        alert('Ошибка при удалении. Попробуйте позже.');
      }
      return false;
    }
  };

  const createTask = async (payload: Partial<Task>): Promise<{ success: boolean; data?: Task; errors?: Record<string, string[]> }> => {
    try {
      const data = await api.fetch<Task>('/tasks', {
        method: 'POST',
        body: payload
      });
      return { success: true, data };
    } catch (e: unknown) {
      const err = e as { response?: { status: number; _data?: { errors: Record<string, string[]> } } };
      if (err.response && err.response.status === 422) {
        return { success: false, errors: err.response._data?.errors || {} };
      }
      if (err.response?.status === 403) {
        alert('У вас нет прав для сохранения этой задачи.');
      } else {
        alert('Произошла ошибка при сохранении. Попробуйте позже.');
      }
      return { success: false };
    }
  };

  const updateTask = async (id: number, payload: Partial<Task>): Promise<{ success: boolean; data?: Task; errors?: Record<string, string[]> }> => {
    try {
      const data = await api.fetch<Task>(`/tasks/${id}`, {
        method: 'PUT',
        body: payload
      });
      return { success: true, data };
    } catch (e: unknown) {
      const err = e as { response?: { status: number; _data?: { errors: Record<string, string[]> } } };
      if (err.response && err.response.status === 422) {
        return { success: false, errors: err.response._data?.errors || {} };
      }
      if (err.response?.status === 403) {
        alert('У вас нет прав для сохранения этой задачи.');
      } else {
        alert('Произошла ошибка при сохранении. Попробуйте позже.');
      }
      return { success: false };
    }
  };

  const saveTask = async (id: number | undefined, payload: Partial<Task>) => {
    if (id) {
      return await updateTask(id, payload);
    }
    return await createTask(payload);
  };

  return {
    deleteTask,
    createTask,
    updateTask,
    saveTask
  };
};
