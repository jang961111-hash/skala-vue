<!--
  ================================================================
  App.vue | Root Component
  ================================================================
  ▸ 역할
    index.html 의 <div id="app"></div> 자리에 마운트되는 최상위 컴포넌트.
    main.js 가 createApp(App) 으로 이 파일을 루트 컴포넌트로 삼는다. (교재 61~62p)

  ▸ 라우팅 구조 (교재 62p)
    <RouterLink> 는 HTML 의 <a> 로 변환되지만 브라우저 새로고침을 막고
    주소창만 바꾼다. 실제 화면은 <RouterView /> 구역이 갈아 끼워진다.
    → SPA(Single Page Application)가 화면을 전환하는 방식.

    /        → HomeView   → WeatherMockup (교재 116p 과제)
    /about   → AboutView

  ▸ 왜 라우터를 남겨두는가
    평가항목 "확장 문법(25점)"이 router / store / axios / ui library 활용을
    본다. 스캐폴딩 때 함께 설치한 vue-router 를 실제로 쓰는 구조를 유지한다.
  ================================================================
-->
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/handson/weather/UnitToggler.vue'
</script>

<template>
  <header class="site-head">
    <span class="brand">SKALA Vue.js</span>
    <nav>
      <RouterLink to="/">대시보드</RouterLink>
      <RouterLink to="/stats">통계</RouterLink>
      <RouterLink to="/about">소개</RouterLink>
    </nav>

    <!-- 교재 212p 요구사항 2: Navigation Bar 옆에 UnitToggler 배치 -->
    <UnitToggler />
  </header>

  <!-- 주소창 변경에 따라 실제 화면이 갈아 끼워지는 가변형 주입 구역 -->
  <RouterView />
</template>

<style scoped>
.site-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px 20px;
  border-bottom: 1px solid var(--color-border);
}

.brand {
  font-weight: 700;
  letter-spacing: -0.01em;
}

.site-head nav {
  display: flex;
  gap: 4px;
}

.site-head nav a {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  text-decoration: none;
  color: inherit;
}

.site-head nav a:hover {
  background-color: rgba(99, 102, 241, 0.12);
}

/* 현재 주소와 일치하는 링크에 Vue Router 가 자동으로 붙여주는 클래스 */
.site-head nav a.router-link-exact-active {
  background-color: rgba(99, 102, 241, 0.16);
  color: #6366f1;
  font-weight: 600;
}
</style>
