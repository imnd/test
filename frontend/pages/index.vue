<template>
  <div class="container">
    <header class="page-header">
      <h1>
        Мои задачи <span v-if="auth.user.value?.is_admin" class="badge badge-in_progress ml-2">Admin</span>
      </h1>
      <div class="page-header__actions">
        <button class="btn btn-primary" @click="openCreateModal">Новая задача</button>
        <button class="btn btn-outline" @click="auth.logout()">Выйти</button>
      </div>
    </header>

    <!-- Filters & Sorting -->
    <div class="surface filters-bar">
      <TaskFilters 
        v-model:search="search" 
        v-model:status="statusFilter"
        @search-input="debounceSearch"
        @status-change="resetPage"
      />
      <TaskSorting 
        v-model="sortBy"
        @change="resetPage"
      />
    </div>

    <!-- Tasks List -->
    <div v-if="loading && tasks.length === 0" class="state-message">
      Загрузка задач...
    </div>
    <div v-else-if="tasks.length === 0" class="surface state-message">
      <p>Задачи не найдены.</p>
    </div>
    <div v-else class="task-list" :class="{ 'is-loading': loading }">
      <TaskCard 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task" 
        :can-edit="canEdit(task)"
        @edit="openEditModal(task)"
        @delete="deleteTask(task.id)"
      />
    </div>

    <!-- Pagination -->
    <TaskPagination 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @change="changePage" 
    />

    <TaskFormModal 
      v-if="isModalOpen" 
      :task="editingTask" 
      @close="closeModal" 
      @saved="fetchTasks(true)" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from '#app';
import { useAuth } from '~/composables/useAuth';
import { useApi } from '~/composables/useApi';
import TaskCard from '~/components/TaskCard.vue';
import TaskFormModal from '~/components/TaskFormModal.vue';
import TaskFilters from '~/components/TaskFilters.vue';
import TaskSorting from '~/components/TaskSorting.vue';
import type { Task, PaginatedResponse } from '~/types';

const auth = useAuth();
const api = useApi();
const route = useRoute();
const router = useRouter();

const tasks = ref<Task[]>([]);
const loading = ref(true);

const search = ref<string>((route.query.search as string) || '');
const statusFilter = ref<string>((route.query.status as string) || '');

const validSorts = ['created_at-desc', 'created_at-asc', 'due_date-asc', 'due_date-desc'];
const initialSort = route.query.sort ? `${route.query.sort as string}-${route.query.dir as string}` : 'created_at-desc';
const sortBy = ref<string>(validSorts.includes(initialSort) ? initialSort : 'created_at-desc');

const isModalOpen = ref(false);
const editingTask = ref<Task | null>(null);

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const currentPage = ref<number>(Number(route.query.page) || 1);
const totalPages = ref(1);

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchTasks();
};

const resetPage = () => {
  currentPage.value = 1;
  fetchTasks();
};

const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    resetPage();
  }, 500);
};

const fetchTasks = async (silent = false) => {
  if (!silent) loading.value = true;
  
  const [sortField, sortDir] = sortBy.value.split('-');
  
  const queryParams = new URLSearchParams();
  if (search.value) queryParams.append('search', search.value);
  if (statusFilter.value) queryParams.append('status', statusFilter.value);
  queryParams.append('sort', sortField);
  queryParams.append('dir', sortDir);
  queryParams.append('page', currentPage.value);

  // Sync to URL
  router.replace({ query: { 
    search: search.value || undefined, 
    status: statusFilter.value || undefined,
    sort: sortField,
    dir: sortDir,
    page: currentPage.value > 1 ? currentPage.value : undefined
  }});

  try {
    const res = await api.fetch<PaginatedResponse<Task>>(`/tasks?${queryParams.toString()}`);
    tasks.value = res.data; // paginated response
    totalPages.value = res.last_page || 1;
  } catch (e) {
    alert('Не удалось загрузить задачи. Попробуйте позже.');
  } finally {
    if (!silent) loading.value = false;
  }
};

const canEdit = (task: Task) => {
  return auth.user.value?.is_admin || auth.user.value?.id === task.user_id;
};

const openCreateModal = () => {
  editingTask.value = null;
  isModalOpen.value = true;
};

const openEditModal = (task: Task) => {
  editingTask.value = { ...task };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const deleteTask = async (id: number) => {
  if (!confirm('Удалить эту задачу?')) return;
  try {
    await api.fetch(`/tasks/${id}`, { method: 'DELETE' });
    tasks.value = tasks.value.filter(t => t.id !== id);
  } catch (e: unknown) {
    const err = e as { response?: { status: number } };
    if (err.response?.status === 403) {
      alert('У вас нет прав для удаления этой задачи.');
    } else {
      alert('Ошибка при удалении. Попробуйте позже.');
    }
  }
};

onMounted(async () => {
  if (!auth.token.value) {
    return router.push('/login');
  }
  await auth.fetchUser();
  if (auth.user.value) {
    fetchTasks();
  }
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.page-header__actions {
  display: flex;
  gap: 0.5rem;
}
.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.filter-group {
  display: flex;
  flex-direction: column;
}
.state-message {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--color-text-muted);
}
.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.task-list.is-loading {
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.ml-2 {
  margin-left: 0.5rem; /* Admin badge margin */
}
</style>
