<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="surface modal-content">
      <h2 class="modal-title">{{ isEditing ? 'Редактировать задачу' : 'Новая задача' }}</h2>
      
      <form @submit.prevent="saveTask">
        <FormInput 
          label="Заголовок *" 
          v-model="form.title" 
          required 
          minlength="3" 
          maxlength="255" 
          :error="errors.title?.[0]" 
        />

        <FormTextarea 
          label="Описание" 
          v-model="form.description" 
          rows="3" 
          :error="errors.description?.[0]" 
        />

        <FormInput 
          label="Дедлайн" 
          type="date" 
          v-model="form.due_date" 
          :error="errors.due_date?.[0]" 
        />

        <FormSelect 
          label="Статус" 
          v-model="form.status" 
          :error="errors.status?.[0]"
          :options="TASK_STATUS_OPTIONS"
        />

        <div class="modal-actions">
          <button type="button" class="btn btn-outline" @click="$emit('close')">Отмена</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTaskActions } from '~/composables/useTaskActions';
import type { Task } from '~/types';
import { TASK_STATUS_OPTIONS } from '~/utils/constants';

const props = defineProps<{
  task?: Task | null;
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const { saveTask: apiSaveTask } = useTaskActions();

const isEditing = ref(false);
const loading = ref(false);
const errors = ref<Record<string, string[]>>({});

const form = ref({
  title: '',
  description: '',
  due_date: '',
  status: 'pending' as Task['status']
});

onMounted(() => {
  if (props.task) {
    isEditing.value = true;
    form.value = {
      title: props.task.title,
      description: props.task.description || '',
      due_date: props.task.due_date ? props.task.due_date.substring(0, 10) : '',
      status: props.task.status
    };
  }
});

const saveTask = async () => {
  loading.value = true;
  errors.value = {};
  
  const { success, errors: apiErrors } = await apiSaveTask(isEditing.value ? props.task?.id : undefined, form.value);
  
  loading.value = false;
  
  if (success) {
    emit('saved');
    emit('close');
  } else if (apiErrors) {
    errors.value = apiErrors;
  }
};
</script>

<style src="./TaskFormModal.css" scoped></style>
