/**
 * ================================================================
 * 교재 230p 요구사항 1 | weatherStore — 실제 날씨 데이터 스토어
 * ================================================================
 * ▸ 왜 스토어가 데이터를 갖는가
 *   212p 에서 단위·즐겨찾기를 스토어로 올렸듯이, 날씨 데이터 자체도
 *   목록(WeatherHomeView)과 상세(WeatherDetailView)가 공유해야 한다.
 *   지금까지는 weatherMockData.js 를 양쪽에서 import 했는데,
 *   **API 호출이 들어오면 "언제 불러왔는지 / 불러오는 중인지 / 실패했는지"**
 *   같은 상태가 생긴다. 그 상태의 주인이 스토어다.
 *
 * ▸ 비동기 처리 (교재 227p)
 *   axios 호출은 전부 비동기다.
 *     async 함수 + await 호출
 *     try / catch / finally 로 성공·실패·마무리를 나눈다
 *
 * ▸ API 키가 없을 때의 동작
 *   이 저장소는 Public 이라 키를 커밋할 수 없다.
 *   키가 없으면 호출을 건너뛰고 Mock 데이터를 그대로 쓴다.
 *   → 채점자가 키 없이 열어도 앱이 정상 동작한다.
 *   → 키를 넣으면 같은 화면이 실시간 데이터로 바뀐다.
 * ================================================================
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { weatherMockData } from '../data/weatherMockData.js'
import {
  fetchCurrentWeather,
  fetchForecast,
  toCityShape,
  hasApiKey,
  fetchAirPollution,
  toAirShape,
  fetchAirForecast,
} from '../api/weatherApi.js'

export const useWeatherStore = defineStore('weather', () => {
  /* ── state ── */
  // 초기값은 Mock. API 호출이 성공하면 실제 데이터로 교체된다.
  const cities = ref([...weatherMockData])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const lastUpdated = ref(null)
  const forecastMap = ref({}) // { cityId: [3시간 단위 예보] }

  /* ── getters ── */
  const isLive = computed(() => cities.value.some((c) => c.isLive))
  const apiKeyReady = computed(() => hasApiKey)
  const statusLabel = computed(() => {
    if (!hasApiKey) return 'Mock 데이터 (API 키 미설정)'
    if (isLoading.value) return '실시간 데이터 불러오는 중…'
    if (errorMessage.value) return `호출 실패 — Mock 데이터 사용 중`
    if (isLive.value) return `실시간 데이터 · ${lastUpdated.value ?? ''}`
    return 'Mock 데이터'
  })

  // 도시별 대기질 예보 조회표 { cityId: { 'YYYY-MM-DDTHH': {aqi,pm25,pm10} } }
  const airForecastMap = ref({})

  /* ================================================================
     [9단원 확장] 환기 지수 — 언제 창문을 열면 좋은가
     ================================================================
     ▸ 왜 만들었나
       교수님: "라이브러리 추가되면 데이터가 추가되는 거지.
                데이터가 추가되면 거기에 또 구현할 게 쭉 늘어날 거야."

       대기질 API 를 붙이고 나니 날씨 예보(40건)와 대기질 예보(96건)가
       같이 생겼다. 두 개를 시간으로 맞추면 새 정보가 나온다.
       날씨만으로도, 대기질만으로도 답할 수 없는 질문이다.

     ▸ 점수 계산 (100점 만점)
       감점  미세먼지  pm25 × 2      최대 50  ← 환기의 핵심 변수
       감점  강수확률  pop × 0.25    최대 25  ← 비 오면 창문을 못 연다
       감점  기온차    |temp-22|×1.5 최대 25  ← 너무 춥거나 더우면 부담
       가점  바람      min(wind×3, 10)        ← 약한 바람은 공기를 밀어낸다

       가중치는 내가 정한 것이라 절대 기준이 아니다.
       다만 "미세먼지가 제일 중요하고, 비가 오면 아예 불가"라는
       상식적인 우선순위는 반영했다.

     ▸ 시간 맞추기
       날씨 예보는 3시간 간격, 대기질 예보는 1시간 간격이라 개수가 다르다.
       UTC 시각 문자열(utcKey)을 키로 조회표를 만들어 맞췄다.
       대기질 예보가 없는 시간대는 계산에서 뺀다 (추측하지 않는다).
     ================================================================ */
  const VENT_BASE = 100

  const ventilationSlots = (cityId) => {
    const fc = forecastMap.value[cityId] ?? []
    const air = airForecastMap.value[cityId] ?? {}
    if (!fc.length || !Object.keys(air).length) return []

    return fc
      .map((f) => {
        const a = air[f.utcKey]
        if (!a) return null // 대기질 예보가 없는 시간대는 판단하지 않는다

        const dustPenalty = Math.min(a.pm25 * 2, 50)
        const rainPenalty = Math.min(f.pop * 0.25, 25)
        const tempPenalty = Math.min(Math.abs(f.temp - 22) * 1.5, 25)
        const windBonus = Math.min(f.wind * 3, 10)

        const score = Math.max(
          0,
          Math.round(VENT_BASE - dustPenalty - rainPenalty - tempPenalty + windBonus),
        )
        return {
          ...f,
          pm25: a.pm25,
          aqi: a.aqi,
          score,
          // 왜 이 점수인지 화면에서 보여주기 위해 근거도 같이 넘긴다
          reason: {
            dust: Math.round(dustPenalty),
            rain: Math.round(rainPenalty),
            temp: Math.round(tempPenalty),
            wind: Math.round(windBonus),
          },
        }
      })
      .filter(Boolean)
  }

  /**
   * 환기하기 좋은 시간대 — **날짜별로 하나씩** 골라 준다.
   *
   * 처음에는 전체에서 점수 상위 3개를 뽑았는데, 셋 다 같은 날이 나왔다.
   * 그 날이 실제로 제일 좋긴 하지만 "오늘은? 내일은?" 에 답을 못 한다.
   * 날짜별 최고 시간대를 주는 쪽이 실제로 쓸 수 있는 정보라고 봤다.
   */
  const bestVentilation = (cityId, days = 4) => {
    const byDate = {}
    for (const slot of ventilationSlots(cityId)) {
      const cur = byDate[slot.date]
      if (!cur || slot.score > cur.score) byDate[slot.date] = slot
    }
    return Object.values(byDate)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, days)
  }

  /** 대기질 예보를 받아 조회표에 담는다 (환기 지수용) */
  const loadAirForecast = async (cityId) => {
    if (!hasApiKey) return
    const city = findCity(cityId)
    if (!city?.coord) return
    try {
      airForecastMap.value[cityId] = await fetchAirForecast(city.coord.lat, city.coord.lon)
      console.log(
        `[weatherStore] ${city.name} 대기질 예보 ${Object.keys(airForecastMap.value[cityId]).length}건 수신`,
      )
    } catch (error) {
      console.warn('[weatherStore] 대기질 예보 실패 — 환기 지수는 표시하지 않는다', error?.message)
    }
  }

  const findCity = (cityId) => cities.value.find((c) => c.id === cityId)

  /**
   * [교재 249p] 특정 도시의 예보에서 **선택 가능한 날짜 목록**을 뽑는다.
   * el-date-picker 의 disabledDate 에 넘겨, 예보가 없는 날은 못 고르게 막는다.
   */
  const availableDates = (cityId) => {
    const list = forecastMap.value[cityId] ?? []
    return [...new Set(list.map((f) => f.date))]
  }

  /** 특정 도시·특정 날짜의 3시간 단위 예보만 골라낸다 */
  const forecastByDate = (cityId, date) => {
    const list = forecastMap.value[cityId] ?? []
    return date ? list.filter((f) => f.date === date) : list.slice(0, 8)
  }

  /* ── actions ── */

  /**
   * [요구사항 1] 전체 도시의 실제 날씨를 불러온다.
   * 도시마다 별도 호출이므로 Promise.allSettled 로 동시에 던진다.
   *   allSettled : 일부가 실패해도 나머지는 살린다 (all 은 하나만 실패해도 전부 reject)
   */
  const loadAllWeather = async () => {
    if (!hasApiKey) {
      console.warn('[weatherStore] API 키가 없어 Mock 데이터를 사용합니다.')
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      /* ============================================================
         [9단원 확장] 날씨 → 대기오염 **연쇄 호출**

         /air_pollution 은 좌표를 요구하는데, 그 좌표는 /weather
         응답 안에 있다. 그래서 순서가 강제된다.
           1) fetchCurrentWeather  → coord 획득
           2) fetchAirPollution(coord) → 대기질

         대기오염이 실패해도 날씨는 살린다.
         .catch(() => null) 로 막아 두면 air 만 null 이 되고
         화면은 그대로 뜬다. (교재 224p 의 폴백을 한 단계 더 적용)
         ============================================================ */
      const results = await Promise.allSettled(
        weatherMockData.map((base) =>
          fetchCurrentWeather(base.english)
            .then((raw) => toCityShape(raw, base))
            .then(async (city) => {
              if (!city.coord) return city
              const air = await fetchAirPollution(city.coord.lat, city.coord.lon)
                .then(toAirShape)
                .catch(() => null)
              return { ...city, air }
            }),
        ),
      )

      const merged = results.map((r, i) =>
        r.status === 'fulfilled' ? r.value : { ...weatherMockData[i] },
      )
      const failed = results.filter((r) => r.status === 'rejected').length

      cities.value = merged
      lastUpdated.value = new Date().toLocaleTimeString('ko-KR')

      if (failed > 0) {
        errorMessage.value = `${failed}개 도시 조회 실패 (해당 도시는 Mock 유지)`
        console.warn('[weatherStore]', errorMessage.value)
      } else {
        console.log(`[weatherStore] 실시간 날씨 ${merged.length}개 도시 갱신 완료`)
      }
    } catch (error) {
      // 4xx/5xx, 네트워크 오프라인 시 여기로 온다 (교재 224p)
      errorMessage.value = error?.message ?? '알 수 없는 오류'
      console.error('[weatherStore] 통신 중 에러:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * [요구사항 2] 특정 도시의 3시간 단위 예보를 불러온다.
   * OpenWeatherMap 의 다른 API(/forecast)를 추가로 활용한 부분.
   */
  const loadForecast = async (cityId) => {
    if (!hasApiKey) return
    const city = findCity(cityId)
    if (!city || forecastMap.value[cityId]) return // 이미 받아왔으면 재요청하지 않는다

    try {
      const data = await fetchForecast(city.english)
      // 40건(5일 × 3시간) 전부 보관한다.
      // 화면은 앞 8건만 보여주지만, 날짜 선택 기능이 나머지를 쓴다.
      forecastMap.value[cityId] = data.list.map((it) => ({
        date: it.dt_txt.slice(0, 10), // 'YYYY-MM-DD'
        time: it.dt_txt.slice(5, 16),
        hour: it.dt_txt.slice(11, 16),
        temp: Math.round(it.main.temp),
        status: it.weather?.[0]?.description ?? '',
        pop: Math.round((it.pop ?? 0) * 100),
        humidity: it.main.humidity,
        wind: Number((it.wind?.speed ?? 0).toFixed(1)),
        // UTC 기준 시각 키 — 대기질 예보(1시간 간격)와 맞추는 데 쓴다
        utcKey: new Date(it.dt * 1000).toISOString().slice(0, 13),
      }))
      console.log(`[weatherStore] ${city.name} 예보 ${forecastMap.value[cityId].length}건 수신`)
    } catch (error) {
      console.error('[weatherStore] 예보 조회 실패:', error)
    }
  }

  return {
    cities,
    isLoading,
    errorMessage,
    lastUpdated,
    forecastMap,
    isLive,
    apiKeyReady,
    statusLabel,
    findCity,
    airForecastMap,
    ventilationSlots,
    bestVentilation,
    loadAirForecast,
    availableDates,
    forecastByDate,
    loadAllWeather,
    loadForecast,
  }
})
