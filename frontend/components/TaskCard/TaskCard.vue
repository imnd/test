<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '~/types';
import { formatDate } from '~/utils/formatters';
import { TASK_STATUS_MAP } from '~/utils/constants';

const props = withDefaults(defineProps<{
  task: Task;
  canEdit?: boolean;
}>(), {
  canEdit: false
});

defineEmits(['edit', 'delete']);

const statusLabel = computed(() => {
  return TASK_STATUS_MAP[props.task.status] || props.task.status;
});
</script>

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

<style src="./TaskCard.css" scoped></style>
