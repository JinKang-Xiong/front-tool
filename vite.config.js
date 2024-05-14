import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import prismjsPlugin from 'vite-plugin-prismjs'
import { plugins } from 'prismjs'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    prismjsPlugin({
      languages:['json','javascript','html','css','scss','java'],
      plugins:['copy-to-clipboard','line-numbers'],
      theme: 'okaidia',
      css: true,
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      // rewrite: path => path.replace(/^\/api/, '')
    },
    '/nestnode':{
      target:'http://127.0.0.1:3000',
      changeOrigin:true,
      rewrite: path => path.replace(/^\/nestnode/, '')
    }
  }  
  }
})
