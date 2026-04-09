import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const basePath = process.env.VITE_BASE_PATH?.trim() || (repositoryName ? `/${repositoryName}/` : "/");

  return {
    base: basePath,
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            markdown: ['react-markdown', 'rehype-highlight'],
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      globals: true,
    },
  }
})
