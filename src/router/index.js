/**
 * ================================================================
 * 교재 179~197p | Vue Router 설정
 * ================================================================
 * 요구사항 1 — 라우터 지연 로딩(Lazy Loading) + Catch-all Route
 *
 * ▸ 지연 로딩이란
 *     component: HomeView                       ← 즉시 로딩 (번들에 포함)
 *     component: () => import('...HomeView.vue') ← 지연 로딩 (별도 청크)
 *
 *   즉시 로딩은 앱을 켤 때 **모든 페이지 코드를 한꺼번에** 내려받는다.
 *   지연 로딩은 그 경로에 **실제로 들어갈 때** 해당 청크만 받는다.
 *   → 첫 화면이 뜨는 속도가 빨라진다. (SPA 의 약점인 초기 로딩 보완)
 *
 *   ※ npm run build 결과를 보면 View 마다 별도 .js 파일이 생기는 것으로 확인 가능
 *
 * ▸ Catch-all Route (195p)
 *     path: '/:pathMatch(.*)*'
 *   위에서 아무것도 안 걸린 나머지 전부를 잡는다.
 *   ⚠️ 반드시 **가장 마지막**에 둔다. 위에 두면 다른 라우트가 실행되지 않는다.
 * ================================================================
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // BASE_URL 은 vite.config.js 의 base 값을 그대로 따라온다.
  // 로컬은 '/', GitHub Pages 는 '/skala-vue/' 가 되어 배포 경로가 자동으로 맞는다.
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    /* ── 요구사항 3 : 메인 대시보드 ── */
    {
      path: '/',
      name: 'weather-home',
      component: () => import('../views/WeatherHomeView.vue'),
    },

    /* ── 요구사항 4 : 동적 세그먼트 (187p)
         도시가 몇 개든 이 한 줄이 전부 받는다 ── */
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },

    /* ── 요구사항 6 : 본인 추가 View (쿼리스트링 정렬) ── */
    {
      path: '/stats',
      name: 'weather-stats',
      component: () => import('../views/WeatherStatsView.vue'),
    },

    /* ── 요구사항 5 : 소개 ── */
    {
      path: '/about',
      name: 'weather-about',
      component: () => import('../views/WeatherAboutView.vue'),
    },

    /* ── 학습 이력 보존 : 단원별 이전 버전을 그대로 남겨 둔다 ──
         제출물은 하나로 통합하되, 발전 과정을 보여주기 위한 경로 */
    {
      path: '/history/mockup',
      name: 'history-mockup',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/history/composition',
      name: 'history-composition',
      component: () => import('../views/CompositionView.vue'),
    },
    {
      path: '/history/component',
      name: 'history-component',
      component: () => import('../views/ComponentView.vue'),
    },

    /* ── 단원별 실습 · Code Challenge (교재 60p~248p) ── */
    {
      path: '/practice',
      name: 'practice',
      // 실습 컴포넌트 50개를 한꺼번에 import 하는 화면이라 지연 로딩이 특히 중요하다.
      // 이 경로에 들어갈 때만 받아오므로 첫 화면 로딩에는 영향이 없다.
      component: () => import('../views/PracticeView.vue'),
    },

    /* ── 요구사항 1 : Catch-all (195p) — 반드시 마지막 ── */
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],

  // 페이지를 이동할 때마다 스크롤을 맨 위로 (상세 → 목록 이동 시 유용)
  scrollBehavior() {
    return { top: 0 }
  },
})

/**
 * ── Navigation Guard (교재 193~194p) ──
 * 요구사항에는 없지만 단원에서 배운 내용이라 로깅 가드를 걸어 두었다.
 *
 *   beforeEach : 이동이 시작되기 직전 → 접근 권한 통제에 주로 쓴다
 *   afterEach  : 이동이 완전히 끝난 후 → 분석 로그 송신 등에 쓴다
 *
 * next() 를 호출해야 통과된다. 호출하지 않으면 이동이 멈춘다.
 */
router.beforeEach((to, from, next) => {
  console.log(`[beforeEach] "${from.fullPath}" → "${to.fullPath}" 이동 시작`)
  next() // 통과 허가 (권한 통제가 필요하면 여기서 next('/') 로 되돌린다)
})

router.afterEach((to) => {
  console.log(`[afterEach] "${to.fullPath}" 렌더링 완료`)
})

export default router
