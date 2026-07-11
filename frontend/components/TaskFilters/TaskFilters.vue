<script setup lang="ts">
import { TASK_STATUS_OPTIONS } from '~/utils/constants';
import { useTaskStore } from '~/stores/tasks';

const taskStore = useTaskStore();

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const onSearch = (val: string) => {
  taskStore.search = val;
  
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => taskStore.resetPage(), 500);
};

const onStatus = (val: string) => {
  taskStore.statusFilter = val;
  taskStore.resetPage();
};
</script>

<template>
  <FormInput 
    label="Поиск"
    :model-value="taskStore.search" 
    @update:model-value="onSearch" 
    placeholder="Поиск по заголовку" 
  />
  
  <FormSelect 
    label="Статус"
    :model-value="taskStore.statusFilter" 
    @update:model-value="onStatus"
    :options="[{ value: '', label: 'Все' }, ...TASK_STATUS_OPTIONS]"
  />
</template>