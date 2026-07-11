<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TaskCard from '~/components/TaskCard/TaskCard.vue';
import TaskFormModal from '~/components/TaskFormModal/TaskFormModal.vue';
import TaskFilters from '~/components/TaskFilters/TaskFilters.vue';
import TaskSorting from '~/components/TaskSorting/TaskSorting.vue';
import type { Task } from '~/types';

import { useAuth } from '~/composables/useAuth';
const auth = useAuth();

import { useTaskStore } from '~/stores/tasks';
const taskStore = useTaskStore();
const isModalOpen = ref(false);
const editingTask = ref<Task | null>(null);

const openCreateModal = () => {
  editingTask.value = null;
  isModalOpen.value = true;
};

const openEditModal = (task: Task) => {
  editingTask.value = { ...task };
  isModalOpen.value = true;
};

const closeModal = () => isModalOpen.value = false;

onMounted(async () => {
  auth.fetchUser();
  await taskStore.loadTasks();
});
</script>

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
      <TaskFilters />
      <TaskSorting />
    </div>

    <!-- Tasks List -->
    <div v-if="taskStore.loading" class="state-message">
      Загрузка задач...
    </div>
    <div v-else-if="taskStore.tasks.length === 0" class="surface state-message">
      Задачи не найдены.
    </div>
    <div v-else class="task-list" :class="{ 'is-loading': taskStore.loading }">
      <TaskCard
        v-for="task in taskStore.tasks"
        :key="task.id"
        :task="task"
        @edit="openEditModal(task)"
      />
    </div>

    <!-- Pagination -->
    <TaskPagination />

    <TaskFormModal 
      v-if="isModalOpen" 
      :task="editingTask" 
      @close="closeModal" 
    />
  </div>
</template>
