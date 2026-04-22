// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'AMS Link Shortener — Shorten & Share Instantly',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
    }
  }
})
