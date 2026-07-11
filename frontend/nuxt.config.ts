// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/main.scss'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
    }
  },
  modules: ['@pinia/nuxt'],
  components: [
    {
      path: '~/components/UI',
      pathPrefix: false,
    },
    '~/components'
  ],
  ssr: false, // SPA mode since we are authenticating via token
})
