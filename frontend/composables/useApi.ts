import { useRuntimeConfig, useCookie, navigateTo } from '#app';

export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useCookie('auth_token');

  const fetch = async <T = any>(endpoint: string, options: any = {}): Promise<T> => {
    const currentToken = useCookie('auth_token').value;
    const headers = new Headers(options.headers || {});
    
    headers.set('Accept', 'application/json');
    if (currentToken) {
      headers.set('Authorization', `Bearer ${currentToken}`);
    }

    try {
      return await $fetch<T>(`${config.public.apiBaseUrl}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        token.value = null;
        if (process.client) {
          navigateTo('/login');
        }
      }
      throw error;
    }
  };

  return { fetch };
};
