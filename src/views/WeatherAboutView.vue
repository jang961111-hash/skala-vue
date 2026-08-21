<!--
  ================================================================
  교재 196p 요구사항 5 | WeatherAboutView.vue  ("/about")
  ================================================================
  "적당한 내용 작성 및 메인 대시보드로 돌아가기 작성"

  기존 AboutView 의 학습 기록 내용을 유지하면서,
  라우터 단원에서 배운 것(라우팅 표 / 돌아가기 버튼)을 추가했다.
  ================================================================
-->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => router.push('/')

const routeTable = ref([
  { path: '/', desc: '날씨 대시보드 (목록·검색·필터)', page: '196p 요구사항 3' },
  { path: '/weather/:cityId', desc: '도시별 상세 관측 정보 — 동적 세그먼트', page: '187p / 요구사항 4' },
  { path: '/stats', desc: '관측 통계 — 쿼리스트링 정렬 (본인 추가)', page: '189p / 요구사항 6' },
  { path: '/about', desc: '이 페이지', page: '요구사항 5' },
  { path: '/history/*', desc: '116p·145p·178p 단계별 학습 이력 보존', page: '—' },
  { path: '/:pathMatch(.*)*', desc: '정의되지 않은 경로 → NotFound', page: '195p / 요구사항 1' },
])

const learned = ref([
  { unit: 'Vue Syntax', page: '60~116p', item: 'v-directive 전반, 이벤트 수식어, v-model' },
  { unit: 'Composition API', page: '117~145p', item: 'ref / reactive / computed / watch / watchEffect' },
  { unit: 'Vue Components', page: '146~178p', item: '라이프사이클, props·emits, provide·inject, slot' },
  { unit: 'Vue Router', page: '179~197p', item: '동적 라우트, 쿼리스트링, 지연 로딩, 가드, Catch-all' },
])
</script>

<template>
  <main class="about">
    <header class="page-head">
      <p class="kicker">SKALA Full-Stack Engineering</p>
      <h1>Frontend-framework: Vue.js</h1>
      <p class="desc">
        강병호 교수님 강의 실습 저장소입니다. 하나의 Weather 앱을 단원마다 발전시켜 왔습니다.
      </p>
      <button class="home-btn" type="button" @click="goHome">← 메인 대시보드로 돌아가기</button>
    </header>

    <section>
      <h2>라우팅 구조</h2>
      <ul class="route-list">
        <li v-for="r in routeTable" :key="r.path">
          <code>{{ r.path }}</code>
          <span class="desc">{{ r.desc }}</span>
          <span class="page">{{ r.page }}</span>
        </li>
      </ul>
    </section>

    <section>
      <h2>단원별 학습 내용</h2>
      <ul class="learn-list">
        <li v-for="l in learned" :key="l.unit">
          <div class="lu">
            <strong>{{ l.unit }}</strong><span class="page">{{ l.page }}</span>
          </div>
          <p>{{ l.item }}</p>
        </li>
      </ul>
    </section>

    <section>
      <h2>이 앱이 거쳐온 단계</h2>
      <ol class="steps">
        <li><b>116p</b> — 단일 파일에 전부 (v-directive)</li>
        <li><b>145p</b> — 일반 함수를 computed 로, watch·watchEffect 추가</li>
        <li><b>178p</b> — 5개 컴포넌트로 분리 (props·emits·slot)</li>
        <li><b>196p</b> — 라우터로 페이지 분리, alert → router.push</li>
      </ol>
      <p class="note">각 단계는 <code>/history/*</code> 경로에 그대로 남겨 두었습니다.</p>
    </section>
  </main>
</template>

<style scoped>
.about {
  max-width: 820px;
  margin: 0 auto;
  padding: 30px 20px 50px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  line-height: 1.7;
}
.kicker {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6366f1;
  font-weight: 600;
}
.page-head h1 {
  margin: 6px 0 10px;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.desc {
  opacity: 0.85;
}
.home-btn {
  margin-top: 14px;
  padding: 8px 18px;
  border: 1px solid #6366f1;
  border-radius: 999px;
  background: transparent;
  color: #6366f1;
  font-weight: 600;
  cursor: pointer;
}
.home-btn:hover {
  background: #6366f1;
  color: #fff;
}
section h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}
.route-list,
.learn-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.route-list li {
  display: grid;
  grid-template-columns: 190px 1fr auto;
  gap: 10px;
  align-items: baseline;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.86rem;
}
.learn-list li {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-left: 3px solid #06b6d4;
  border-radius: 8px;
}
.lu {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.page {
  font-size: 0.72rem;
  opacity: 0.6;
  white-space: nowrap;
}
.learn-list p {
  font-size: 0.85rem;
  opacity: 0.8;
  margin-top: 3px;
}
.steps {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.9rem;
}
.note {
  margin-top: 10px;
  font-size: 0.8rem;
  opacity: 0.7;
}
code {
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(127, 127, 127, 0.15);
  font-size: 0.85em;
}
@media (max-width: 640px) {
  .route-list li {
    grid-template-columns: 1fr;
  }
}
</style>
