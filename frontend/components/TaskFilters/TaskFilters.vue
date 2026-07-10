<script setup lang="ts">
import { TASK_STATUS_OPTIONS } from '~/utils/constants';

defineProps<{
  search: string;
  status: string;
}>();

const emit = defineEmits<{
  'update:search': [value: string];
  'update:status': [value: string];
  'search-input': [];
  'status-change': [];
}>();

const onSearch = (val: string) => {
  emit('update:search', val);
  emit('search-input');
};

const onStatus = (val: string) => {
  emit('update:status', val);
  emit('status-change');
};
</script>

<template>
  <FormInput 
    label="Поиск"
    :model-value="search" 
    @update:model-value="onSearch" 
    placeholder="Поиск по заголовку" 
  />
  
  <FormSelect 
    label="Статус"
    :model-value="status" 
    @update:model-value="onStatus"
    :options="[{ value: '', label: 'Все' }, ...TASK_STATUS_OPTIONS]"
  />
</template>