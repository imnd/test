<template>
  <div v-if="totalPages > 1" class="pagination">
    <button class="btn btn-outline" :disabled="currentPage === 1" @click="onChange(currentPage - 1)">Назад</button>
    <span class="pagination-info">Страница {{ currentPage }} из {{ totalPages }}</span>
    <button class="btn btn-outline" :disabled="currentPage === totalPages" @click="onChange(currentPage + 1)">Вперед</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  'change': [page: number]
}>();

const onChange = (page: number) => {
  emit('change', page);
};
</script>

<style src="./TaskPagination.css" scoped></style>
