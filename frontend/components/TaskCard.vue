<template>
  <div class="surface task-card">
    <div>
      <h3 class="task-title">{{ task.title }}</h3>
      <p class="task-desc" v-if="task.description">{{ task.description }}</p>
      <div class="task-card__meta">
        <span :class="['badge', 'badge-' + task.status]">
          {{ statusLabel }}
        </span>
        <span class="task-card__due" v-if="task.due_date">
          ⏳ Дедлайн: {{ formatDate(task.due_date) }}
        </span>
      </div>
    </div>
    
    <div v-if="canEdit" class="task-card__actions">
      <button class="btn btn-outline" @click="$emit('edit')">Ред.</button>
      <button class="btn btn-danger" @click="$emit('delete')">Удал.</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '~/types';
import { formatDate } from '~/utils/formatters';

const props = withDefaults(defineProps<{
  task: Task;
  canEdit?: boolean;
}>(), {
  canEdit: false
});

defineEmits(['edit', 'delete']);

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    pending: 'Ожидает',
    in_progress: 'В процессе',
    completed: 'Завершено'
  };
  return map[props.task.status] || props.task.status;
});

</script>

<style scoped>
.task-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
.task-title {
  margin: 0;
  font-size: 1.25rem;
}
.task-desc {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}
.task-card__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
.task-card__due {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.task-card__actions {
  display: flex;
  gap: 0.5rem;
}
</style>
