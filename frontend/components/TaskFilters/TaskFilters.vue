<template>
  <div class="filter-group">
    <label class="form-label">Поиск</label>
    <input 
      type="text" 
      :value="search" 
      @input="onSearch" 
      class="form-input" 
      placeholder="Поиск по заголовку" 
    />
  </div>
  <div class="filter-group">
    <label class="form-label">Статус</label>
    <select :value="status" @change="onStatus" class="form-select">
      <option value="">Все</option>
      <option value="pending">Ожидает</option>
      <option value="in_progress">В процессе</option>
      <option value="completed">Завершено</option>
    </select>
  </div>
</template>

<script setup lang="ts">
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

const onSearch = (e: Event) => {
  emit('update:search', (e.target as HTMLInputElement).value);
  emit('search-input');
};

const onStatus = (e: Event) => {
  emit('update:status', (e.target as HTMLSelectElement).value);
  emit('status-change');
};
</script>
