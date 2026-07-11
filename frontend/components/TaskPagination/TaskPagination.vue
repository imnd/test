<template>
  <div v-if="taskStore.totalPages > 1" class="pagination">
    <button class="btn btn-outline" :disabled="taskStore.currentPage === 1" @click="taskStore.changePage(taskStore.currentPage - 1)">Назад</button>
    <span class="pagination-info">Страница {{ taskStore.currentPage }} из {{ taskStore.totalPages }}</span>
    <button class="btn btn-outline" :disabled="taskStore.currentPage === taskStore.totalPages" @click="taskStore.changePage(taskStore.currentPage + 1)">Вперед</button>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '~/stores/tasks';

const taskStore = useTaskStore();
</script>

<style src="./TaskPagination.css" scoped></style>
