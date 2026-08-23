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
import PhotoPlanner from '../components/PhotoPlanner.vue'
import LightTimeline from '../components/LightTimeline.vue'
import { bestVentilation } from '../composables/useVentilation.js'

// 교재 212p 요구사항 3 — 상세 페이지에도 같은 단위 설정이 적용된다.
// 목록 화면과 이 화면은 라우터로 갈린 남남이지만 같은 스토어를 본다.
const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()
const weatherStore = useWeatherStore()

const route = useRoute()
const router = useRouter()

/* ================================================================
   city 를 ref 가 아니라 computed 로 바꾼 이유
   ================================================================
   처음에는 onMounted 에서 찾은 결과를 ref 에 **한 번** 담았다.
   그런데 상세 URL 로 바로 들어오면(북마크, 새로고침, 링크 공유)
   목록 화면을 거치지 않아 loadAllWeather 가 아직 안 돈 상태였다.
   그 시점의 스토어에는 Mock 밖에 없으니 Mock 이 담기고,
   나중에 실데이터가 들어와도 ref 는 옛 객체를 그대로 붙잡고 있었다.

   computed 로 바꾸면 스토어의 cities 가 갱신되는 순간 다시 계산된다.
   "한 번 찾아서 담는다" 와 "스토어를 계속 바라본다" 의 차이다.
   ================================================================ */
const city = computed(() => weatherStore.findCity(route.params.cityId))

// 경로 패턴은 맞는데 데이터가 없는 경우 (예: /weather/city_99)
const notFound = computed(() => !city.value)

onMounted(async () => {
  const cityId = route.params.cityId
  console.log(`[useRoute] 현재 경로: ${route.path} / 동적 파라미터 cityId: ${cityId}`)

  if (notFound.value) {
    console.warn(`[WeatherDetail] "${cityId}" 에 해당하는 도시를 찾지 못했습니다.`)
    return
  }

  // 이 화면으로 바로 들어왔다면 목록 화면을 안 거쳤으므로 아직 Mock 상태다.
  // lastUpdated 가 비어 있는 것으로 판별해 여기서 직접 불러온다.
  if (!weatherStore.lastUpdated) {
    await weatherStore.loadAllWeather()
  }

  // [요구사항 2] OpenWeatherMap 의 다른 API 추가 — 3시간 단위 예보
  // 교수님 언급: "어느 지역을 클릭한 다음 그 지역의 3시간 단위 날씨를 가져온다든가"
  weatherStore.loadForecast(cityId)
  // [9단원 확장] 환기 지수용 대기질 예보. 실패해도 날씨는 그대로 뜬다.
  weatherStore.loadAirForecast(cityId)
})

/* ================================================================
   [교재 249p] UI Library 적용 — el-date-picker 로 예보 날짜 선택
   ================================================================
   ▸ 교수님 강조
     "웹 라이브러리를 예쁘다고 쓰는 게 아니에요. 그 안에 쓰이는 기능들이 있어요.
      현재 날짜가 아니라 앞으로 특정한 날에 날씨를 보고 싶다,
      그러면 그 날짜 선택하는 컨트롤을 쓰면 되는 거지."

   ▸ 왜 이 컨트롤이 필요했나
     /forecast 는 5일치를 3시간 간격으로 40건 준다.
     그동안은 앞 8건(약 하루치)만 보여줬으므로 나머지 4일치가 낭비되고 있었다.
     날짜를 고를 수 있어야 40건을 전부 쓸 수 있다.

     달력 UI 를 직접 만들려면 월 이동·요일 배치·선택 상태·비활성 날짜 처리를
     전부 짜야 한다. 라이브러리는 그걸 props 몇 개로 끝낸다.

   ▸ disabledDate
     예보가 없는 날(오늘 이전, 5일 이후)은 아예 못 고르게 막는다.
     "고를 수는 있는데 결과가 없다" 보다 "애초에 못 고른다" 가 낫다.
   ================================================================ */
const selectedDate = ref('')

// 예보가 존재하는 날짜만 선택 가능하게 한다
const disabledDate = (date) => {
  if (!city.value) return true
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return !weatherStore.availableDates(city.value.id).includes(`${y}-${m}-${d}`)
}

// 선택한 날짜의 예보만 보여준다 (선택 전에는 앞 8건)
const forecast = computed(() =>
  city.value ? weatherStore.forecastByDate(city.value.id, selectedDate.value) : [],
)

/* [9단원 확장] 환기하기 좋은 시간 상위 3개 */
/* 사진 지수에는 **날짜 필터를 거치지 않은 40건 전부**가 필요하다.
   화면의 forecast 는 선택한 날짜만 남기므로 그걸 쓰면 안 된다. */
const allForecast = computed(() =>
  city.value ? (weatherStore.forecastMap[city.value.id] ?? []) : [],
)
const airTable = computed(() =>
  city.value ? (weatherStore.airForecastMap[city.value.id] ?? {}) : {},
)

const bestVent = computed(() => bestVentilation(allForecast.value, airTable.value, 4))

const dateLabel = computed(() =>
  selectedDate.value ? `${selectedDate.value} 예보` : '3시간 단위 예보 (기본 8건)',
)

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
        <!--
          [9단원 확장] 대기질은 Air Pollution API 실데이터.
          city.air 가 있으면 실데이터, 없으면(키 없음/호출 실패) Mock 으로 떨어진다.
          어느 쪽인지 화면에서 구분되도록 배지를 붙였다.
        -->
        <div class="obs">
          <span>미세먼지 (PM2.5)</span>
          <strong v-if="city.air">{{ city.air.pm25 }}<small class="unit">㎍/㎥</small></strong>
          <strong v-else>{{ city.observation.dust }}<small class="mock">Mock</small></strong>
        </div>
        <div class="obs">
          <span>대기질</span>
          <strong v-if="city.air">
            <span class="aqi" :class="`aqi-${city.air.aqi}`">{{ city.air.grade }}</span>
          </strong>
          <strong v-else>—</strong>
        </div>
        <div v-if="city.air" class="obs">
          <span>미세먼지 (PM10)</span>
          <strong>{{ city.air.pm10 }}<small class="unit">㎍/㎥</small></strong>
        </div>
      </section>

      <!-- [요구사항 2] 3시간 단위 예보 (OpenWeatherMap /forecast API) -->
      <!-- 시그니처 — 하루의 빛이 어떻게 지나가는지 한 줄로 -->
      <section class="timeline-wrap">
        <LightTimeline :city="city" />
      </section>

      <!-- 앱 주제 — 사진 찍기 좋은 시간 -->
      <PhotoPlanner :city="city" :forecast="allForecast" :air-table="airTable" />

      <!-- ================================================================
           [9단원 확장] 환기 지수 — 날씨 예보 × 대기질 예보
           두 API 를 시간으로 맞춰야만 나오는 정보다.
           대기질 예보가 없으면 이 섹션 자체가 안 나온다 (추측하지 않는다).
           ================================================================ -->
      <section v-if="bestVent.length" class="vent">
        <h3>🪟 창문 열기 좋은 시간</h3>
        <p class="vent-sub">
          날씨 예보와 대기질 예보를 시간대별로 맞춰 계산한 뒤, 날짜마다 가장 좋은 시간을 하나씩
          골랐습니다. 미세먼지·강수확률·기온을 감점하고 바람을 가점합니다.
        </p>
        <ul class="vent-list">
          <li v-for="v in bestVent" :key="v.utcKey" class="vent-item">
            <div class="vent-head">
              <strong class="vent-time">{{ v.time }}</strong>
              <span class="vent-badge" :class="v.grade.cls">
                {{ v.grade.label }} {{ v.score }}점
              </span>
            </div>
            <div class="vent-bar"><span :style="{ width: v.score + '%' }"></span></div>
            <!-- 근거는 컴포저블이 breakdown 으로 넘겨준다. 사진 지수와 같은 형식이다. -->
            <div class="vent-why">
              <span v-for="b in v.breakdown" :key="b.key" :class="{ minus: b.value < 0 }">
                {{ b.label }} {{ b.value > 0 ? '+' : '' }}{{ b.value }}
              </span>
              <span class="vent-raw">
                초미세 {{ v.pm25 }}㎍/㎥ · 강수 {{ v.pop }}% · {{ configStore.convertTemp(v.temp)
                }}{{ configStore.unitSymbol }} · 바람 {{ v.wind }}m/s
              </span>
            </div>
          </li>
        </ul>
      </section>

      <section v-if="weatherStore.availableDates(city.id).length" class="forecast">
        <div class="fc-head">
          <h3>⏱️ {{ dateLabel }}</h3>
          <!-- 교재 249p — Element Plus 날짜 선택 컨트롤 -->
          <el-date-picker
            v-model="selectedDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="날짜 선택"
            :disabled-date="disabledDate"
            size="small"
            clearable
          />
        </div>
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
.timeline-wrap {
  margin: var(--gap-3) 0;
  padding: var(--gap-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.vent {
  margin-top: 22px;
}
.vent h3 {
  font-size: 1rem;
  font-weight: 650;
}
.vent-sub {
  font-size: 0.78rem;
  opacity: 0.65;
  margin: 4px 0 12px;
}
.vent-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}
.vent-item {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 11px 14px;
}
.vent-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.vent-time {
  font-size: 0.95rem;
  font-variant-numeric: tabular-nums;
}
.vent-badge {
  font-size: 0.74rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
}
.g1 {
  background: rgba(6, 182, 212, 0.18);
  color: #0369a1;
}
.g2 {
  background: rgba(34, 197, 94, 0.18);
  color: #15803d;
}
.g3 {
  background: rgba(234, 179, 8, 0.2);
  color: #a16207;
}
.g4 {
  background: rgba(249, 115, 22, 0.18);
  color: #c2410c;
}
.g5 {
  background: rgba(239, 68, 68, 0.18);
  color: #b91c1c;
}
/* 점수를 숫자로만 두면 감이 안 온다. 막대로 같이 보여준다. */
.vent-bar {
  height: 5px;
  border-radius: 999px;
  background: rgba(127, 127, 127, 0.16);
  margin: 9px 0 8px;
  overflow: hidden;
}
.vent-bar span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #06b6d4, #22c55e);
}
.vent-why .minus {
  color: #c2410c;
}
.vent-raw {
  opacity: 0.75;
}
.vent-why {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  font-size: 0.72rem;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}
.aqi {
  padding: 1px 9px;
  border-radius: 999px;
  font-size: 0.82rem;
}
/* AQI 1~5 를 색으로 구분. 숫자만 보면 좋은지 나쁜지 모른다. */
.aqi-1 {
  background: rgba(6, 182, 212, 0.18);
  color: #0369a1;
}
.aqi-2 {
  background: rgba(34, 197, 94, 0.18);
  color: #15803d;
}
.aqi-3 {
  background: rgba(234, 179, 8, 0.2);
  color: #a16207;
}
.aqi-4 {
  background: rgba(249, 115, 22, 0.2);
  color: #c2410c;
}
.aqi-5 {
  background: rgba(239, 68, 68, 0.2);
  color: #b91c1c;
}
.unit {
  margin-left: 3px;
  font-size: 0.66rem;
  font-weight: 400;
  opacity: 0.6;
}
.mock {
  margin-left: 5px;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.6rem;
  font-weight: 500;
  background: rgba(127, 127, 127, 0.18);
  opacity: 0.75;
}
.fc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.forecast h3 {
  font-size: 0.98rem;
  font-weight: 650;
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
