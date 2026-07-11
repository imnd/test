<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '~/types';
import { formatDate } from '~/utils/formatters';
import { TASK_STATUS_MAP } from '~/utils/constants';
import { useTaskStore } from '~/stores/tasks';
import { useTaskActions } from '~/composables/useTaskActions';
import { useAuth } from '~/composables/useAuth';
const auth = useAuth();

const props = withDefaults(defineProps<{
  task: Task;
}>(), {});

defineEmits(['edit']);

const canEdit = (task: Task) => auth.user.value?.is_admin || auth.user.value?.id === task.user_id;

const statusLabel = computed(() => TASK_STATUS_MAP[props.task.status] || props.task.status);

const taskStore = useTaskStore();
const { deleteTask: apiDeleteTask } = useTaskActions();

const deleteTask = async () => {
  if (!confirm('Удалить эту задачу?')) return;
  const success = await apiDeleteTask(props.task.id);
  if (success) {
    taskStore.removeTask(props.task.id);
  }
};
</script>

<template>
  <div class="surface task-card">
    <div>
      <h3 class="task-title">{{ task.title }}</h3>
      <p class="task-desc" v-if="task.description">{{ task.description }}</p>
      
      <div class="task-meta">
        <span class="badge" :class="'badge-' + task.status">{{ statusLabel }}</span>
        <span class="due-date" v-if="task.due_date" :class="{ 'overdue': new Date(task.due_date) < new Date() && task.status !== 'completed' }">
          Дедлайн: {{ formatDate(task.due_date) }}
        </span>
      </div>
    </div>

    <div v-if="canEdit" class="task-card__actions">
      <button class="btn btn-outline" @click="$emit('edit')">Ред.</button>
      <button class="btn btn-danger" @click="deleteTask">Удал.</button>
    </div>
  </div>
</template>

<style src="./TaskCard.css" scoped></style>
