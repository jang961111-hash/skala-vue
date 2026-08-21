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

  // [교재 264p] 로컬 개발 서버(Dev Server) 속성 제어
  server: {
    port: 3000, // 개발 서버 포트를 3000 번으로 고정 (기본값 5173 → 3000)
    open: true, // npm run dev 시 기본 브라우저 자동 실행
  },

  // [교재 264p] 컴파일 완료된 산출물(Production Build) 사양 제어
  build: {
    outDir: 'dist', // 최종 정적 리소스가 저장될 출력 디렉토리
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
