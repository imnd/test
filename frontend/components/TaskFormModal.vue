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
        >
          <option value="pending">Ожидает</option>
          <option value="in_progress">В процессе</option>
          <option value="completed">Завершено</option>
        </FormSelect>

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
import { useApi } from '~/composables/useApi';
import type { Task } from '~/types';

const props = defineProps<{
  task?: Task | null;
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const api = useApi();

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
  
  try {
    if (isEditing.value) {
      await api.fetch(`/tasks/${props.task.id}`, {
        method: 'PUT',
        body: form.value
      });
    } else {
      await api.fetch('/tasks', {
        method: 'POST',
        body: form.value
      });
    }
    emit('saved');
    emit('close');
  } catch (e: unknown) {
    const err = e as { response?: { status: number; _data?: { errors: Record<string, string[]> } } };
    if (err.response && err.response.status === 422) {
      errors.value = err.response._data?.errors || {};
    } else if (err.response?.status === 403) {
      alert('У вас нет прав для сохранения этой задачи.');
    } else {
      alert('Произошла ошибка при сохранении. Попробуйте позже.');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-title {
  margin-bottom: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}
</style>
