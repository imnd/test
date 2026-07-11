import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Task, PaginatedResponse } from '~/types';
import { useApi } from '~/composables/useApi';
import { useRoute, useRouter } from '#app';

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const loading = ref(true);
  const totalPages = ref(1);
  const api = useApi();

  const route = useRoute();
  const router = useRouter();

  const search = ref<string>((route.query.search as string) || '');
  const statusFilter = ref<string>((route.query.status as string) || '');

  const validSorts = ['created_at-desc', 'created_at-asc', 'due_date-asc', 'due_date-desc'];
  const initialSort = route.query.sort ? `${route.query.sort as string}-${route.query.dir as string}` : 'created_at-desc';
  const sortBy = ref<string>(validSorts.includes(initialSort) ? initialSort : 'created_at-desc');

  const currentPage = ref<number>(Number(route.query.page) || 1);

  const loadTasks = async (silent = false) => {
    if (!silent) {
      loading.value = true;
    }

    const [sortField = 'created_at', sortDir = 'desc'] = sortBy.value.split('-');

    const queryParams = new URLSearchParams();
    if (search.value) {
      queryParams.append('search', search.value);
    }
    if (statusFilter.value) {
      queryParams.append('status', statusFilter.value);
    }
    queryParams.append('sort', sortField);
    queryParams.append('dir', sortDir);
    queryParams.append('page', currentPage.value.toString());

    router.replace({
      query: {
        search: search.value || undefined,
        status: statusFilter.value || undefined,
        sort: sortField,
        dir: sortDir,
        page: currentPage.value > 1 ? currentPage.value : undefined
      }
    });

    try {
      const res = await api.fetch<PaginatedResponse<Task>>(`/tasks?${queryParams.toString()}`);
      tasks.value = res.data;
      totalPages.value = res.last_page || 1;
    } catch (e) {
      console.error(e);
      alert('Не удалось загрузить задачи. Попробуйте позже.');
    } finally {
      if (!silent) {
        loading.value = false;
      }
    }
  };

  const removeTask = (id: number) => {
    tasks.value = tasks.value.filter(t => t.id !== id);
  };

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    loadTasks();
  };

  const resetPage = () => {
    currentPage.value = 1;
    loadTasks();
  };

  const updateTaskInStore = (updatedTask: Task) => {
    const index = tasks.value.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    } else {
      // If it's a new task, we might want to unshift it or just reload.
      // Since the user is just editing, this is fine. For new tasks we'll put it at the top.
      tasks.value.unshift(updatedTask);
    }
  };

  return {
    tasks,
    loading,
    totalPages,
    search,
    statusFilter,
    sortBy,
    currentPage,
    loadTasks,
    removeTask,
    updateTaskInStore,
    changePage,
    resetPage,
  };
});
