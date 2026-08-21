<!--
  ================================================================
  교재 196p 요구사항 3 | WeatherHomeView.vue  ("/")
  ================================================================
  ▸ 178p 의 WeatherParent 를 라우터의 "/" 경로에 맞게 옮긴 것이다.
    자식 컴포넌트(BaseDashboardCard / SearchBar / WeatherCard / StatSummary)는
    그대로 재사용한다 — 분리해 둔 효과가 여기서 나온다.

  ★★ 178p 와 달라진 단 하나 ★★
      window.alert(...)                    ← 제거
      router.push('/weather/' + city.id)   ← Programmatic Navigation (191p)

    자식(WeatherCard)은 여전히 click-detail 을 emit 할 뿐이다.
    "그걸 받아서 무엇을 하는가"만 부모가 바꿨다.
    → 컴포넌트를 잘 분리해 두면 이런 변경이 한 곳에서 끝난다.

  ▸ router.push 를 쓰는 이유 (191p)
    <RouterLink> 는 템플릿에서 정적으로 링크를 걸 때 쓴다.
    "버튼을 눌러 조건을 따져보고 이동" 처럼 스크립트 흐름 안에서
    이동해야 할 때는 router.push() 를 호출한다.

  ▸ [요구사항 6 연계] Query String 동기화 (189p)
    검색어를 주소창(?search=수원)에 반영해 두면
    그 URL 을 복사해 보내도 같은 검색 상태로 열린다.
    onMounted 에서 route.query.search 를 읽어 상태를 복원한다.
  ================================================================
-->
<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { weatherMockData } from '../data/weatherMockData.js'
import BaseDashboardCard from '../components/handson/weather/BaseDashboardCard.vue'
import SearchBar from '../components/handson/weather/SearchBar.vue'
import WeatherCard from '../components/handson/weather/WeatherCard.vue'
import StatSummary from '../components/handson/weather/StatSummary.vue'

const route = useRoute()
const router = useRouter()

/* ── 반응형 상태 (178p 와 동일) ── */
const weatherList = ref(weatherMockData)
const searchQuery = ref('')
const selectedCityInfo = ref('')
const onlyRainy = ref(false)

/* ── computed 3종 (145p 유지) ── */
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

/* ── watcher 3종 (145p 유지) ── */
watch(selectedCityInfo, (newVal, oldVal) => {
  console.log(`[watch] 선택 도시: "${oldVal || '(없음)'}" → "${newVal}"`)
})

watchEffect(() => {
  console.log(`[watchEffect] 검색어: "${searchQuery.value}" → ${filteredWeatherList.value.length}건`)
})

watch(
  () => filteredWeatherList.value.length,
  (n, o) => {
    if (n === 0 && o > 0) console.warn(`[watch] 검색 결과가 사라졌습니다. (직전 ${o}건)`)
  },
)

/* ── 교재 189p: 마운트 시 주소창의 ?search= 값으로 상태 복원 ── */
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
    console.log(`[useRoute] 쿼리스트링에서 검색어 복원: "${route.query.search}"`)
  }
})

/* ── 자식 emit 핸들러 ── */
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
  // 검색어를 주소창에 동기화한다 (뒤로가기 기록이 쌓이지 않도록 replace 사용)
  router.replace({ query: newQuery ? { search: newQuery } : {} })
}

const handleUpdateRainy = (checked) => {
  onlyRainy.value = checked
}

const handleSelectCard = (cityName) => {
  selectedCityInfo.value = cityName
}

/* ★ 178p 에서는 window.alert 였던 자리 — 이제 페이지를 이동한다 (191p) */
const handleClickDetail = (cityName) => {
  const city = weatherList.value.find((c) => c.name === cityName)
  if (city) router.push(`/weather/${city.id}`)
}
</script>

<template>
  <div class="weather-home">
    <header class="page-head">
      <h2>🌤️ 전국 날씨 대시보드</h2>
      <p class="sub">SKALA Vue.js 과제 — 교재 196p Hands on: Weather Router</p>
    </header>

    <BaseDashboardCard>
      <template v-slot:header><h3>🔎 도시 검색</h3></template>
      <SearchBar
        :search-query="searchQuery"
        :only-rainy="onlyRainy"
        @update-query="handleUpdateQuery"
        @update-rainy="handleUpdateRainy"
      />
    </BaseDashboardCard>

    <p class="status-bar" :class="{ 'is-idle': !selectedCityInfo }">
      <template v-if="selectedCityInfo">
        📍 <strong>{{ selectedCityInfo }}</strong
        >이 선택되었습니다.
      </template>
      <template v-else>카드를 클릭하면 선택되고, [상세보기]를 누르면 상세 페이지로 이동합니다.</template>
    </p>

    <StatSummary :count="filteredWeatherList.length" :average-temp="averageTemp" />

    <BaseDashboardCard>
      <template v-slot:header><h3>📋 지역별 날씨 현황</h3></template>

      <p v-if="searchState === 'notfound'" class="empty-state">
        🔍 "{{ searchQuery }}" 와 일치하는 도시가 없습니다.
      </p>
      <template v-else>
        <p class="search-hint" :class="{ muted: searchState === 'empty' }">
          <template v-if="searchState === 'found'">
            🔎 "{{ searchQuery }}" 검색 결과 {{ filteredWeatherList.length }}건
          </template>
          <template v-else>전체 {{ weatherList.length }}개 도시를 표시 중입니다.</template>
        </p>

        <div class="card-grid">
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
.weather-home {
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
  opacity: 0.65;
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
