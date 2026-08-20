<!--
  ================================================================
  교재 178p | Hands on - Weather Component  (과제)
  ================================================================
  SKALA Full-Stack Engineering / Frontend-framework: Vue.js
  강병호 교수님 · 2026-08-20 (Day3)

  ▸ 145p Weather Composition 을 **기능 변경 없이** 5개 컴포넌트로 분리한 것이다.
    화면과 동작은 완전히 같고, 바뀐 것은 **책임의 배치**뿐이다.

  ────────────────────────────────────────────────────────────────
  요구사항 대조표
  ────────────────────────────────────────────────────────────────
  [v] 1. WeatherParent.vue      — 모든 반응형 데이터 유지          ← 이 파일
  [v] 2. BaseDashboardCard.vue  — 디자인 공통화 + <slot>
  [v] 3. SearchBar.vue          — props: 검색어 / emits: update-query
  [v] 4. WeatherCard.vue        — props: 도시 객체 / emits: select-card, click-detail
  [v] 5. 각 컴포넌트 디자인을 <style scoped> 로 분리
  [v] 6. slot 자식은 부모 스코프에서 컴파일 (아래 설명)
  [v] 7. 본인 추가 컴포넌트 — StatSummary.vue

  ────────────────────────────────────────────────────────────────
  분리 후 데이터 흐름 (한 방향으로만 흐른다)
  ────────────────────────────────────────────────────────────────

      WeatherParent  ← 모든 상태(ref)와 파생값(computed)의 주인
        │
        │ props ↓            emits ↑
        │
        ├── SearchBar      :search-query    → @update-query
        │                  :only-rainy      → @update-rainy
        │
        ├── WeatherCard    :city :selected  → @select-card
        │                                   → @click-detail
        │
        └── StatSummary    :count :average-temp   (emits 없음, 표시 전용)

    자식은 **아무도 상태를 갖지 않는다.** 전부 부모에게 요청(emit)할 뿐이다.
    이것이 "단방향 데이터 흐름(one-way data flow)" 이다.

  ────────────────────────────────────────────────────────────────
  ★ 요구사항 6 — slot 안의 자식은 누구의 스코프인가
  ────────────────────────────────────────────────────────────────
    아래 코드에서 SearchBar 는 시각적으로 BaseDashboardCard **안**에 있다.

        <BaseDashboardCard>
          <SearchBar :search-query="searchQuery" @update-query="..." />
        </BaseDashboardCard>

    그런데 searchQuery 와 핸들러는 **WeatherParent 의 것**이다.
    BaseDashboardCard 는 searchQuery 가 뭔지 전혀 모른다.

    → slot 으로 전달되는 콘텐츠는 **부모(WeatherParent)의 스코프에서
      컴파일되고 평가**되기 때문이다.
      그래서 중간에 낀 BaseDashboardCard 를 거치지 않고 직접 통신한다.

    (이게 안 됐다면 BaseDashboardCard 가 searchQuery 를 props 로 받아
     SearchBar 에 다시 넘기는 props drilling 이 필요했을 것이다)
  ================================================================
-->
<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import StatSummary from './StatSummary.vue'

/* ────────────────────────────────────────────────────────────
   요구사항 1 — 모든 반응형 데이터는 이 부모가 갖는다
   ──────────────────────────────────────────────────────────── */
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 62, wind: 2.4, feelsLike: 31 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 88, wind: 3.1, feelsLike: 26 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 74, wind: 4.8, feelsLike: 28 },
  { id: 'city_04', name: '강릉', temp: 22, status: '비', humidity: 91, wind: 5.2, feelsLike: 23 },
  { id: 'city_05', name: '제주', temp: 29, status: '맑음', humidity: 70, wind: 6.0, feelsLike: 33 },
  { id: 'city_06', name: '대전', temp: 25, status: '구름', humidity: 66, wind: 1.9, feelsLike: 27 },
])

const searchQuery = ref('')
const selectedCityInfo = ref('')
const onlyRainy = ref(false)

/* ── 145p 에서 만든 computed 3종을 그대로 유지 ── */
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query && !onlyRainy.value) return weatherList.value
  return weatherList.value.filter((city) => {
    const matchKeyword = !query || city.name.includes(query)
    const matchRainy = !onlyRainy.value || city.status === '비'
    return matchKeyword && matchRainy
  })
})

const averageTemp = computed(() => {
  const list = filteredWeatherList.value
  if (list.length === 0) return 0
  return (list.reduce((acc, c) => acc + c.temp, 0) / list.length).toFixed(1)
})

const searchState = computed(() => {
  if (searchQuery.value.trim() === '') return 'empty'
  return filteredWeatherList.value.length > 0 ? 'found' : 'notfound'
})

/* ── 145p 에서 만든 watcher 3종을 그대로 유지 ── */
watch(selectedCityInfo, (newVal, oldVal) => {
  console.log(`[watch] 선택 도시: "${oldVal || '(없음)'}" → "${newVal}"`)
})

watchEffect(() => {
  console.log(
    `[watchEffect] 검색어: "${searchQuery.value}" → ${filteredWeatherList.value.length}건`,
  )
})

watch(
  () => filteredWeatherList.value.length,
  (newCount, oldCount) => {
    if (newCount === 0 && oldCount > 0) {
      console.warn(`[watch] 검색 결과가 사라졌습니다. (직전 ${oldCount}건)`)
    }
  },
)

/* ────────────────────────────────────────────────────────────
   자식이 emit 한 이벤트를 받아 상태를 바꾸는 핸들러들
   ── 상태를 바꿀 수 있는 것은 오직 이 부모뿐이다 ──
   ──────────────────────────────────────────────────────────── */

// SearchBar 의 update-query — payload 로 새 검색어가 들어온다
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

// SearchBar 의 update-rainy
const handleUpdateRainy = (checked) => {
  onlyRainy.value = checked
}

// WeatherCard 의 select-card — payload 로 도시 이름이 들어온다
const handleSelectCard = (cityName) => {
  selectedCityInfo.value = cityName
}

// WeatherCard 의 click-detail — payload 2개(도시명, 상태)를 받는다
const handleClickDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="weather-parent">
    <header class="page-head">
      <h2>🌤️ 전국 날씨 대시보드 <small>(Component 분리판)</small></h2>
      <p class="sub">SKALA Vue.js 과제 — 교재 178p Hands on: Weather Component</p>
    </header>

    <!-- ① 검색 영역 — BaseDashboardCard 껍데기에 SearchBar 를 주입 -->
    <BaseDashboardCard>
      <template v-slot:header>
        <h3>🔎 도시 검색</h3>
      </template>

      <!-- ★ 요구사항 6: SearchBar 는 BaseDashboardCard 안에 있지만
           searchQuery / handleUpdateQuery 는 WeatherParent 의 것이다.
           slot 콘텐츠는 부모 스코프에서 평가되므로 직접 바인딩된다. -->
      <SearchBar
        :search-query="searchQuery"
        :only-rainy="onlyRainy"
        @update-query="handleUpdateQuery"
        @update-rainy="handleUpdateRainy"
      />
    </BaseDashboardCard>

    <!-- 선택 상태바 -->
    <p class="status-bar" :class="{ 'is-idle': !selectedCityInfo }">
      <template v-if="selectedCityInfo">
        📍 <strong>{{ selectedCityInfo }}</strong
        >이 선택되었습니다.
      </template>
      <template v-else>카드를 클릭하면 여기에 선택한 도시가 표시됩니다.</template>
    </p>

    <!-- ② 요약 통계 — 요구사항 7 의 추가 컴포넌트 -->
    <StatSummary :count="filteredWeatherList.length" :average-temp="averageTemp" />

    <!-- ③ 목록 영역 — 같은 껍데기를 재사용한다 (디자인 공통화의 효과) -->
    <BaseDashboardCard>
      <template v-slot:header>
        <h3>📋 지역별 날씨 현황</h3>
      </template>

      <!-- 검색 결과 3분기 안내 (145p 요구사항 4 유지) -->
      <p v-if="searchState === 'notfound'" class="empty-state">
        🔍 "{{ searchQuery }}" 와 일치하는 도시가 없습니다. 검색어나 필터를 확인해 주세요.
      </p>
      <template v-else>
        <p class="search-hint" :class="{ muted: searchState === 'empty' }">
          <template v-if="searchState === 'found'">
            🔎 "{{ searchQuery }}" 검색 결과 {{ filteredWeatherList.length }}건
          </template>
          <template v-else> 전체 {{ weatherList.length }}개 도시를 표시 중입니다. </template>
        </p>

        <div class="card-grid">
          <!-- 요구사항 1(116p): v-for + :key 유지
               분리 후에는 각 도시 객체를 props 로 넘긴다 -->
          <WeatherCard
            v-for="city in filteredWeatherList"
            :key="city.id"
            :city="city"
            :selected="selectedCityInfo === city.name"
            @select-card="handleSelectCard"
            @click-detail="handleClickDetail"
          />
        </div>
      </template>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
/* 요구사항 5: 부모는 "배치"만 책임진다.
   검색바·카드·통계의 세부 디자인은 각 자식 파일의 <style scoped> 에 있다. */
.weather-parent {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  line-height: 1.6;
}

.page-head h2 {
  font-size: 1.55rem;
  font-weight: 700;
}

.page-head h2 small {
  font-size: 0.6em;
  font-weight: 500;
  opacity: 0.6;
}

.page-head .sub {
  font-size: 0.85rem;
  opacity: 0.65;
  margin-top: 4px;
}

.status-bar {
  padding: 11px 16px;
  border-left: 4px solid #6366f1;
  background: rgba(99, 102, 241, 0.08);
  border-radius: 0 6px 6px 0;
  font-size: 0.92rem;
}

.status-bar.is-idle {
  border-left-color: var(--color-border);
  background: transparent;
  opacity: 0.6;
}

.search-hint {
  font-size: 0.88rem;
  color: #0369a1;
  margin-bottom: 12px;
}

.search-hint.muted {
  color: inherit;
  opacity: 0.6;
}

.empty-state {
  padding: 20px 0;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.75;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
}
</style>
