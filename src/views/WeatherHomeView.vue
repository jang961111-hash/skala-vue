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
import { toLocalHM } from '../composables/usePhotoTime.js'
import { useRoute, useRouter } from 'vue-router'
import { useFavoriteStore } from '../stores/favoriteStore.js'
import { useWeatherStore } from '../stores/weatherStore.js'
import BaseDashboardCard from '../components/handson/weather/BaseDashboardCard.vue'
import SearchBar from '../components/handson/weather/SearchBar.vue'
import WeatherCard from '../components/handson/weather/WeatherCard.vue'
import StatSummary from '../components/handson/weather/StatSummary.vue'

const route = useRoute()
const router = useRouter()

// [요구사항 4] 즐겨찾기 스토어 — 목록/상세/페이지 이동을 넘어 상태가 유지된다
const favoriteStore = useFavoriteStore()

// 교재 230p 요구사항 1 — 날씨 데이터를 스토어에서 가져온다.
// API 키가 있으면 실시간, 없으면 Mock 으로 자동 폴백된다.
const weatherStore = useWeatherStore()
const onlyFavorite = ref(false)

/* ── 반응형 상태 (178p 와 동일) ── */
// 스토어의 cities 를 그대로 참조한다 (별도 ref 를 두면 동기화 문제가 생긴다)
const weatherList = computed(() => weatherStore.cities)
const searchQuery = ref('')
const selectedCityInfo = ref('')
const onlyRainy = ref(false)

/* ── computed 3종 (145p 유지) ── */
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query && !onlyRainy.value && !onlyFavorite.value) return weatherList.value
  return weatherList.value.filter((city) => {
    const matchKeyword = !query || city.name.includes(query)
    const matchRainy = !onlyRainy.value || city.status === '비'
    const matchFav = !onlyFavorite.value || favoriteStore.isFavorite(city.id)
    return matchKeyword && matchRainy && matchFav
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
  console.log(
    `[watchEffect] 검색어: "${searchQuery.value}" → ${filteredWeatherList.value.length}건`,
  )
})

watch(
  () => filteredWeatherList.value.length,
  (n, o) => {
    if (n === 0 && o > 0) console.warn(`[watch] 검색 결과가 사라졌습니다. (직전 ${o}건)`)
  },
)

/* ── 교재 189p: 마운트 시 주소창의 ?search= 값으로 상태 복원 ── */
/* ================================================================
   오늘의 촬영 시간 — 추가 API 호출 없이 만든다
   ================================================================
   일출·일몰은 현재 날씨 응답(/weather)에 이미 들어 있다.
   6개 도시를 부를 때 같이 받아 왔으므로 계산만 하면 된다.

   예보나 대기질까지 보려면 도시마다 API 를 더 불러야 해서
   여기서는 시각만 보여주고 점수는 상세 페이지에서 낸다.
   첫 화면은 가볍게 유지하는 쪽을 택했다.
   ================================================================ */
const goldenHours = computed(() =>
  weatherList.value
    .filter((c) => c.sunset)
    .map((c) => ({
      id: c.id,
      name: c.name,
      // 저녁 골든아워 = 해 지기 전 1시간
      from: toLocalHM(c.sunset - 3600, c.timezone ?? 0),
      to: toLocalHM(c.sunset, c.timezone ?? 0),
    })),
)

onMounted(() => {
  // 교재 153p — Mounting 이 API 호출 최적 타이밍
  weatherStore.loadAllWeather()

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
      <h2>📷 오늘 어디서 찍을까</h2>
      <p class="sub">
        날씨를 나열하는 대신 판단을 줍니다. 도시를 고르면 해가 뜨고 지는 시각 · 구름량 · 미세먼지를
        합쳐 촬영하기 좋은 시간을 점수로 매깁니다.
      </p>
    </header>

    <!-- 오늘의 저녁 골든아워 — 이미 받아온 일몰 시각만 쓰므로 추가 호출이 없다 -->
    <section v-if="goldenHours.length" class="golden-strip">
      <span class="gs-label">🌇 오늘 저녁 골든아워</span>
      <ul>
        <li v-for="g in goldenHours" :key="g.id">
          <RouterLink :to="`/weather/${g.id}`">
            <b>{{ g.name }}</b>
            <span>{{ g.from }}–{{ g.to }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <!-- 교재 230p — 데이터 출처/상태 표시 -->
    <div
      class="data-status"
      :class="{ live: weatherStore.isLive, loading: weatherStore.isLoading }"
    >
      <span class="dot"></span>
      <span>{{ weatherStore.statusLabel }}</span>
      <button
        v-if="weatherStore.apiKeyReady"
        type="button"
        :disabled="weatherStore.isLoading"
        @click="weatherStore.loadAllWeather"
      >
        {{ weatherStore.isLoading ? '불러오는 중…' : '새로고침' }}
      </button>
      <span v-else class="guide">
        <code>.env.local</code> 에 <code>VITE_OPENWEATHER_API_KEY</code> 를 넣으면 실시간 데이터로
        바뀝니다.
      </span>
    </div>

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
      <template v-else
        >카드를 클릭하면 선택되고, [상세보기]를 누르면 상세 페이지로 이동합니다.</template
      >
    </p>

    <StatSummary :count="filteredWeatherList.length" :average-temp="averageTemp" />

    <!-- [요구사항 4] 즐겨찾기 필터 — 스토어 상태를 화면에서 활용 -->
    <div class="fav-bar">
      <span>⭐ 즐겨찾기 {{ favoriteStore.favoriteCount }}곳</span>
      <label>
        <input type="checkbox" v-model="onlyFavorite" />
        즐겨찾기만 보기
      </label>
      <button v-if="favoriteStore.hasFavorite" type="button" @click="favoriteStore.clearAll">
        전체 해제
      </button>
    </div>

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
.golden-strip {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 11px 15px;
  margin-bottom: 18px;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.12), rgba(6, 182, 212, 0.1));
}
.gs-label {
  font-size: 0.78rem;
  font-weight: 650;
  white-space: nowrap;
}
.golden-strip ul {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 8px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.golden-strip a {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  font-size: 0.76rem;
  text-decoration: none;
  color: inherit;
}
.golden-strip a span {
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}

.data-status {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 8px 14px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 0.82rem;
}
.data-status .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  flex-shrink: 0;
}
.data-status.live .dot {
  background: #22c55e;
}
.data-status.loading .dot {
  background: #f59e0b;
}
.data-status button {
  padding: 3px 12px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0.78rem;
}
.data-status button:disabled {
  opacity: 0.5;
  cursor: default;
}
.data-status .guide {
  opacity: 0.7;
  font-size: 0.78rem;
}
.data-status code {
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(127, 127, 127, 0.15);
}

.fav-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 9px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.86rem;
}
.fav-bar label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.fav-bar button {
  padding: 3px 11px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0.8rem;
}

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
