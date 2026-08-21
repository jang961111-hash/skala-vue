<!--
  ================================================================
  교재 196p 요구사항 4 | WeatherDetailView.vue  ("/weather/:cityId")
  ================================================================
  ▸ Dynamic Route Matching (교재 187p)
      라우터 설정:  path: '/weather/:cityId'
                              ↑ 콜론(:)을 붙인 부분이 동적 세그먼트

      도시가 6개든 600개든 라우트는 **한 줄이면 된다.**
      /weather/city_01, /weather/city_05 ... 전부 이 하나가 받는다.

  ▸ 값 수신
      const route = useRoute()
      route.params.cityId   ← 주소창의 그 자리에 들어온 값

  ▸ onMounted 에서 데이터를 고르는 이유 (교재 153p 라이프사이클)
      Mounting 단계가 "화면이 붙은 직후 = API 호출 최적 타이밍"이다.
      실무라면 여기서 axios 로 서버에 요청한다.
      지금은 서버가 없으니 Mock Data 에서 찾는 것으로 대신한다.

  ▸ 없는 도시 ID 로 들어오면?
      /weather/city_99 처럼 존재하지 않는 값이 올 수 있다.
      Catch-all 라우트는 "경로 패턴"이 안 맞을 때 작동하지, 이 경우는
      패턴은 맞고 **데이터만 없는** 상황이다. → 직접 처리해야 한다.
  ================================================================
-->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '../stores/weatherStore.js'
import { useConfigStore } from '../stores/configStore.js'
import { useFavoriteStore } from '../stores/favoriteStore.js'

// 교재 212p 요구사항 3 — 상세 페이지에도 같은 단위 설정이 적용된다.
// 목록 화면과 이 화면은 라우터로 갈린 남남이지만 같은 스토어를 본다.
const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()
const weatherStore = useWeatherStore()

const route = useRoute()
const router = useRouter()

const city = ref(null)
const notFound = ref(false)

onMounted(() => {
  const cityId = route.params.cityId
  console.log(`[useRoute] 현재 경로: ${route.path} / 동적 파라미터 cityId: ${cityId}`)

  const found = weatherStore.findCity(cityId)
  if (found) {
    city.value = found
  } else {
    notFound.value = true
    console.warn(`[WeatherDetail] "${cityId}" 에 해당하는 도시를 찾지 못했습니다.`)
  }

  // [요구사항 2] OpenWeatherMap 의 다른 API 추가 — 3시간 단위 예보
  // 교수님 언급: "어느 지역을 클릭한 다음 그 지역의 3시간 단위 날씨를 가져온다든가"
  if (found) weatherStore.loadForecast(cityId)
})

// 이 도시의 예보 목록 (API 키가 없으면 빈 배열)
const forecast = computed(() => (city.value ? (weatherStore.forecastMap[city.value.id] ?? []) : []))

// 교재 191p — router.back() 은 브라우저 뒤로가기와 같다.
// 단, 주소창에 직접 URL 을 치고 들어온 경우 돌아갈 기록이 없을 수 있어
// push 로 목록으로 보내는 편이 안전하다.
const goList = () => router.push('/')

// 변환 로직은 configStore.convertTemp 하나를 공유한다 (메인/상세 중복 제거)
const displayTemp = computed(() => (city.value ? configStore.convertTemp(city.value.temp) : 0))
const displayFeels = computed(() =>
  city.value ? configStore.convertTemp(city.value.feelsLike) : 0,
)
</script>

<template>
  <main class="detail">
    <!-- 정상 케이스 -->
    <template v-if="city">
      <nav class="crumb">
        <button type="button" @click="goList">← 대시보드로</button>
        <span>/ 상세 관측 정보</span>
      </nav>

      <header class="detail-head" :class="city.temp >= 25 ? 'is-hot' : 'is-cool'">
        <div>
          <p class="station">관측소 {{ city.observation.station }}</p>
          <h2>
            {{ city.name }}
            <button
              type="button"
              class="fav"
              :class="{ on: favoriteStore.isFavorite(city.id) }"
              @click="favoriteStore.toggleFavorite(city.id)"
            >
              {{ favoriteStore.isFavorite(city.id) ? '★' : '☆' }}
            </button>
          </h2>
          <p class="status">{{ city.status }}</p>
        </div>
        <div class="temp-big">
          {{ displayTemp }}<span>{{ configStore.unitSymbol }}</span>
          <small>체감 {{ displayFeels }}{{ configStore.unitSymbol }}</small>
        </div>
      </header>

      <section class="obs-grid">
        <div class="obs">
          <span>습도</span><strong>{{ city.humidity }}%</strong>
        </div>
        <div class="obs">
          <span>풍속</span><strong>{{ city.wind }}m/s</strong>
        </div>
        <div class="obs">
          <span>기압</span><strong>{{ city.observation.pressure }}hPa</strong>
        </div>
        <div class="obs">
          <span>가시거리</span><strong>{{ city.observation.visibility }}km</strong>
        </div>
        <div class="obs">
          <span>자외선</span><strong>{{ city.observation.uv }}</strong>
        </div>
        <div class="obs">
          <span>미세먼지</span><strong>{{ city.observation.dust }}</strong>
        </div>
      </section>

      <!-- [요구사항 2] 3시간 단위 예보 (OpenWeatherMap /forecast API) -->
      <section v-if="forecast.length" class="forecast">
        <h3>⏱️ 3시간 단위 예보</h3>
        <div class="fc-scroll">
          <div v-for="(f, i) in forecast" :key="i" class="fc">
            <span class="fc-time">{{ f.time }}</span>
            <strong class="fc-temp"
              >{{ configStore.convertTemp(f.temp) }}{{ configStore.unitSymbol }}</strong
            >
            <span class="fc-status">{{ f.status }}</span>
            <span class="fc-pop">💧{{ f.pop }}%</span>
          </div>
        </div>
      </section>
      <p v-else-if="!weatherStore.apiKeyReady" class="no-forecast">
        ⏱️ 3시간 단위 예보는 API 키를 설정하면 표시됩니다.
      </p>

      <p class="route-note">
        이 페이지의 주소는 <code>/weather/{{ city.id }}</code> 입니다. 라우터에는
        <code>/weather/:cityId</code> 한 줄만 정의돼 있고, 도시가 몇 개든 이 하나가 전부 받습니다.
      </p>
    </template>

    <!-- 없는 도시 ID -->
    <template v-else-if="notFound">
      <div class="not-found">
        <h2>🔍 해당 도시를 찾을 수 없습니다</h2>
        <p>
          요청한 도시 코드: <code>{{ route.params.cityId }}</code>
        </p>
        <p class="hint">
          경로 패턴(<code>/weather/:cityId</code>)은 맞지만 데이터가 없는 경우입니다. Catch-all
          라우트가 아니라 이 화면이 직접 처리합니다.
        </p>
        <button type="button" @click="goList">대시보드로 돌아가기</button>
      </div>
    </template>
  </main>
</template>

<style scoped>
.forecast h3 {
  font-size: 0.98rem;
  font-weight: 650;
  margin-bottom: 10px;
}
.fc-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
}
.fc {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 92px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}
.fc-time {
  font-size: 0.68rem;
  opacity: 0.65;
}
.fc-temp {
  font-size: 1.1rem;
}
.fc-status {
  font-size: 0.72rem;
  opacity: 0.8;
  text-align: center;
}
.fc-pop {
  font-size: 0.7rem;
  color: #0ea5e9;
}
.no-forecast {
  font-size: 0.82rem;
  opacity: 0.6;
}

.fav {
  padding: 0 6px;
  font-size: 0.8em;
  line-height: 1;
  border: 0;
  background: transparent;
  color: var(--color-text);
  opacity: 0.35;
  cursor: pointer;
}
.fav.on {
  color: #f59e0b;
  opacity: 1;
}

.detail {
  max-width: 820px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  line-height: 1.6;
}
.crumb {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  opacity: 0.75;
}
.crumb button {
  padding: 4px 12px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0.85rem;
}
.detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px;
  border-radius: 14px;
  border: 1px solid var(--color-border);
  border-left-width: 5px;
}
.detail-head.is-hot {
  border-left-color: #f97316;
}
.detail-head.is-cool {
  border-left-color: #0ea5e9;
}
.station {
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  opacity: 0.6;
}
.detail-head h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 2px 0;
}
.detail-head .status {
  font-size: 0.9rem;
  opacity: 0.75;
}
.temp-big {
  text-align: right;
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1;
}
.temp-big span {
  font-size: 0.42em;
  opacity: 0.7;
}
.temp-big small {
  display: block;
  font-size: 0.28em;
  font-weight: 500;
  opacity: 0.65;
  margin-top: 6px;
}
.obs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}
.obs {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}
.obs span {
  font-size: 0.74rem;
  opacity: 0.65;
}
.obs strong {
  font-size: 1.1rem;
}
.route-note,
.hint {
  font-size: 0.82rem;
  opacity: 0.7;
}
code {
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(127, 127, 127, 0.15);
  font-size: 0.9em;
}
.not-found {
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.not-found button {
  margin-top: 8px;
  padding: 8px 18px;
  border: 1px solid #6366f1;
  border-radius: 999px;
  background: transparent;
  color: #6366f1;
  cursor: pointer;
}
</style>
