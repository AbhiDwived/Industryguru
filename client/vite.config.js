
export default {
  plugins: [],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: [
      'all',
      'industryguru-frontend-1neygd-23b016-147-93-18-171.traefik.me'
    ]
  },
  build: {
    outDir: 'dist'
  }
}
