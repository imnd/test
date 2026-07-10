<template>
  <div class="login-container">
    <div class="surface login-card">
      <h1 class="login-title">To-Do List</h1>
      <p class="login-subtitle">Войдите в систему</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" v-model="form.email" class="form-input" required />
          <p v-if="errors.email" class="error-text">{{ errors.email[0] }}</p>
        </div>
        
        <div class="form-group">
          <label class="form-label">Пароль</label>
          <input type="password" v-model="form.password" class="form-input" required />
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%" :disabled="loading">
          {{ loading ? 'Загрузка...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

const auth = useAuth();
const form = ref({ email: '', password: '' });
const errors = ref({});
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errors.value = {};
  const res = await auth.login(form.value);
  if (!res.success) {
    errors.value = res.errors;
  }
  loading.value = false;
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.login-card {
  width: 100%;
  max-width: 400px;
}
.login-title {
  text-align: center;
  margin-bottom: 1rem;
}
.login-subtitle {
  text-align: center;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}
</style>
