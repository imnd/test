<template>
  <div class="filter-group">
    <label class="form-label">Сортировка</label>
    <select :value="taskStore.sortBy" @change="onChange" class="form-select">
      <option value="created_at-desc">Сначала новые</option>
      <option value="created_at-asc">Сначала старые</option>
      <option value="due_date-asc">По дедлайну (сначала близкие)</option>
      <option value="due_date-desc">По дедлайну (сначала дальние)</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '~/stores/tasks';

const taskStore = useTaskStore();

const onChange = (e: Event) => {
  taskStore.sortBy = (e.target as HTMLSelectElement).value;
  taskStore.resetPage();
};
</script>
