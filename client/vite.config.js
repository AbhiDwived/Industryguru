export default {
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
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'industryguru-frontend-fah7v9-71df13-147-93-18-171.traefik.me'
    ]
  },
  build: {
    outDir: 'dist'
  }
}