import { useState, useCookie, navigateTo } from '#app';
import { useApi } from './useApi';
import type { User, AuthResponse } from '~/types';

export const useAuth = () => {
  const user = useState<User | null>('user', () => null);
  const token = useCookie('auth_token');
  const api = useApi();

  const login = async (credentials: Record<string, string>) => {
    try {
      const response = await api.fetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: credentials,
      });
      token.value = response.access_token;
      await fetchUser();
      navigateTo('/');
      return { success: true };
    } catch (error: unknown) {
      const err = error as { response?: { _data?: { errors: Record<string, string[]> } } };
      return { success: false, errors: err.response?._data?.errors || { message: ['Ошибка авторизации'] } };
    }
  };

  const logout = async () => {
    try {
      await api.fetch('/auth/logout', { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token.value}` }
      });
    } catch (e) {}
    token.value = null;
    user.value = null;
    navigateTo('/login');
  };

  const fetchUser = async () => {
    if (!token.value) return null;
    try {
      const data = await api.fetch<User>('/user', {
        headers: { 'Authorization': `Bearer ${token.value}` }
      });
      user.value = data;
      return data;
    } catch (e) {
      user.value = null;
      return null;
    }
  };

  return {
    user,
    token,
    login,
    logout,
    fetchUser,
  };
};
