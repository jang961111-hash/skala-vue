import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 는 https://<계정>.github.io/<저장소>/ 하위 경로로 서비스되므로
  // 정적 자원 경로 앞에 저장소명을 붙여야 한다.
  // 로컬 개발/프리뷰에서는 '/' 가 되도록 환경변수로 분기한다.
  //   로컬        : npm run dev / npm run preview  → '/'
  //   Pages 배포  : VITE_BASE=/skala-vue/ npm run build
  // router 는 createWebHistory(import.meta.env.BASE_URL) 를 쓰므로
  // 이 값 하나만 바꾸면 라우팅 경로까지 함께 따라온다.
  base: process.env.VITE_BASE || '/',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
