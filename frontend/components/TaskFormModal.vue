<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="surface modal-content">
      <h2 class="modal-title">{{ isEditing ? 'Редактировать задачу' : 'Новая задача' }}</h2>
      
      <form @submit.prevent="saveTask">
        <div class="form-group">
          <label class="form-label">Заголовок *</label>
          <input type="text" v-model="form.title" class="form-input" required minlength="3" maxlength="255" />
          <p v-if="errors.title" class="error-text">{{ errors.title[0] }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">Описание</label>
          <textarea v-model="form.description" class="form-textarea" rows="3"></textarea>
          <p v-if="errors.description" class="error-text">{{ errors.description[0] }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">Дедлайн</label>
          <input type="date" v-model="form.due_date" class="form-input" />
          <p v-if="errors.due_date" class="error-text">{{ errors.due_date[0] }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">Статус</label>
          <select v-model="form.status" class="form-select">
            <option value="pending">Ожидает</option>
            <option value="in_progress">В процессе</option>
            <option value="completed">Завершено</option>
          </select>
          <p v-if="errors.status" class="error-text">{{ errors.status[0] }}</p>
        </div>

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

<script setup>
import { ref, onMounted } from 'vue';
import { useApi } from '~/composables/useApi';

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);
const api = useApi();

const isEditing = ref(false);
const loading = ref(false);
const errors = ref({});

const form = ref({
  title: '',
  description: '',
  due_date: '',
  status: 'pending'
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
  } catch (e) {
    if (e.response && e.response.status === 422) {
      errors.value = e.response._data.errors;
    } else if (e.response?.status === 403) {
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
