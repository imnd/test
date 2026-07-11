import { useAuth } from '~/composables/useAuth';
import { defineNuxtRouteMiddleware, navigateTo } from '#app';

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth();
  
  // Если токена нет, и пользователь не на странице логина — редирект на /login
  if (!auth.token.value && to.path !== '/login') {
    return navigateTo('/login');
  }

  // Если токен есть, и пользователь на странице логина — редирект на главную
  if (auth.token.value && to.path === '/login') {
    return navigateTo('/');
  }
});
