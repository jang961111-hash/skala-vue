/**
 * ================================================================
 * 교재 223~228p | OpenWeatherMap API 호출 계층
 * ================================================================
 * ▸ 왜 api/ 폴더로 분리했나 (교수님 강의 언급)
 *     "실무에 가게 되면 API 들을 호출하는 걸 또 따로 폴더에 다 모아놓는다.
 *      호출하는 부분만 따로 관리한다"
 *
 *   컴포넌트마다 axios 를 직접 부르면
 *     · BASE_URL 이 여기저기 흩어지고
 *     · 에러 처리 방식이 제각각이 되고
 *     · API 주소가 바뀌면 전부 찾아 고쳐야 한다
 *   → 호출을 한 파일에 모아두면 그 한 곳만 고치면 된다.
 *
 * ▸ axios 인스턴스 (교재 227p 공통 설정)
 *     baseURL 과 공통 params 를 미리 박아두면
 *     각 호출부는 뒤쪽 경로와 달라지는 값만 넘기면 된다.
 *
 * ▸ API 키가 없을 때
 *     이 저장소는 Public 이라 키를 커밋할 수 없다.
 *     키가 없으면 호출하지 않고 hasApiKey=false 를 돌려주어
 *     화면이 Mock 데이터로 동작하게 한다. (앱이 죽지 않는다)
 * ================================================================
 */
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

/** 키가 실제로 들어있는지 — 빈 문자열/공백/undefined 를 모두 걸러낸다 */
export const hasApiKey = Boolean(API_KEY && API_KEY.trim())

/**
 * 공통 axios 인스턴스
 * baseURL 과 공통 쿼리(appid / units / lang)를 미리 설정해 둔다.
 *   units=metric  섭씨로 받는다 (화씨 변환은 configStore 가 담당)
 *   lang=kr       날씨 설명을 한글로 받는다
 */
const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 8000,
  params: {
    appid: API_KEY,
    units: 'metric',
    lang: 'kr',
  },
})

/**
 * [요구사항 1] Current Weather API (교재 220p)
 *   GET /weather?q={영문도시명}
 *
 * @param {string} cityEnglish 영문 도시명 (예: 'Seoul')
 * @returns {Promise<object>} 원본 응답 데이터(JSON)
 */
export const fetchCurrentWeather = async (cityEnglish) => {
  // Axios 는 응답 문자열을 자동으로 JSON 파싱해 준다.
  // fetch() 였다면 .json() 을 한 번 더 호출해야 한다. (교재 222p)
  const response = await weatherClient.get('/weather', {
    params: { q: cityEnglish },
  })
  return response.data
}

/**
 * [요구사항 2] 5 Day / 3 Hour Forecast API — OpenWeatherMap 의 다른 API 추가
 *   GET /forecast?q={영문도시명}
 *
 * 교수님 언급: "어느 지역을 클릭한 다음 그 지역의 3시간 단위 날씨를 가져온다든가"
 * 무료 등급에서 5일치를 3시간 간격으로 준다.
 */
export const fetchForecast = async (cityEnglish) => {
  const response = await weatherClient.get('/forecast', {
    params: { q: cityEnglish },
  })
  return response.data
}

/**
 * OpenWeather 응답을 이 앱의 도시 객체 형태로 변환한다.
 *
 * ▸ 왜 변환하나
 *   백엔드 응답 구조와 화면이 쓰는 구조는 다르다.
 *   응답을 그대로 화면에 뿌리면, API 가 바뀔 때 화면 전체를 고쳐야 한다.
 *   변환을 한 곳에 두면 여기만 고치면 된다. (Anti-Corruption Layer)
 */
/**
 * 좌표로 현재 날씨 — 내 위치 기능용.
 *
 * /weather 는 도시명(q) 도 받고 좌표(lat, lon) 도 받는다.
 * 도시 목록은 q 로, 내 위치는 좌표로 부른다. 같은 응답 형태라
 * toCityShape 를 그대로 재사용할 수 있다.
 */
export const fetchWeatherByCoord = async (lat, lon) => {
  const { data } = await weatherClient.get('/weather', { params: { lat, lon } })
  return data
}

/** 좌표로 3시간 예보 (내 위치용) */
export const fetchForecastByCoord = async (lat, lon) => {
  const { data } = await weatherClient.get('/forecast', { params: { lat, lon } })
  return data
}

/**
 * [9단원 확장] 대기질 **예보** — /air_pollution/forecast
 *
 * 현재 대기질(/air_pollution)과 달리 앞으로 4일치를 **1시간 간격 96건**으로 준다.
 * 날씨 예보(/forecast, 3시간 간격 40건)와 시간을 맞춰 쓰면
 * "언제 창문을 열면 좋은가"를 계산할 수 있다.
 *
 * 반환은 { 'YYYY-MM-DD HH': {aqi, pm25, pm10} } 형태의 조회표로 만든다.
 * 배열로 두면 매번 find 를 돌아야 하는데, 40건 × 96건이면 낭비다.
 */
export const fetchAirForecast = async (lat, lon) => {
  const { data } = await weatherClient.get('/air_pollution/forecast', { params: { lat, lon } })
  const table = {}
  for (const it of data.list ?? []) {
    // dt 는 UTC 초. 화면이 쓰는 dt_txt 와 맞추려면 같은 기준이어야 한다.
    const key = new Date(it.dt * 1000).toISOString().slice(0, 13) // 'YYYY-MM-DDTHH'
    table[key] = {
      aqi: it.main.aqi,
      pm25: Math.round(it.components.pm2_5),
      pm10: Math.round(it.components.pm10),
    }
  }
  return table
}

/**
 * [교재 9단원 — 외부 라이브러리로 과제 확장 / 249p 요구사항 2]
 * OpenWeather **Air Pollution API** 로 대기질을 가져온다.
 *
 * ▸ 왜 추가했나
 *   상세 페이지의 미세먼지 값이 Mock 에 하드코딩돼 있었다.
 *   날씨는 실데이터인데 대기질만 가짜라 앞뒤가 안 맞았다.
 *
 * ▸ 왜 도시명이 아니라 좌표를 받나
 *   /weather 는 q=Seoul 처럼 도시명을 받지만,
 *   /air_pollution 은 **좌표(lat, lon)만** 받는다.
 *   다행히 /weather 응답에 coord 가 들어 있어서 그걸 그대로 넘긴다.
 *   좌표를 따로 하드코딩하지 않아도 되고, 도시를 추가해도 저절로 따라온다.
 *
 * ▸ 응답 형태
 *   { list: [ { main: { aqi: 1~5 }, components: { pm2_5, pm10, ... } } ] }
 */
export const fetchAirPollution = async (lat, lon) => {
  const { data } = await weatherClient.get('/air_pollution', { params: { lat, lon } })
  return data.list?.[0] ?? null
}

/**
 * AQI 는 1~5 정수로만 온다. 사람이 읽는 말로 바꿔 준다.
 * (WHO 기준이 아니라 OpenWeather 자체 등급이다)
 */
const AQI_LABEL = ['', '좋음', '보통', '나쁨', '매우나쁨', '최악']

export const toAirShape = (raw) => {
  if (!raw) return null
  return {
    aqi: raw.main.aqi,
    grade: AQI_LABEL[raw.main.aqi] ?? '알수없음',
    pm25: Math.round(raw.components.pm2_5),
    pm10: Math.round(raw.components.pm10),
    o3: raw.components.o3,
    isLive: true,
  }
}

export const toCityShape = (raw, base) => ({
  ...base,
  temp: Math.round(raw.main.temp),
  feelsLike: Math.round(raw.main.feels_like),
  humidity: raw.main.humidity,
  wind: Number(raw.wind.speed.toFixed(1)),
  status: raw.weather?.[0]?.description ?? base.status,
  icon: raw.weather?.[0]?.icon ?? null,
  // 대기오염 API 가 좌표를 요구하므로 여기서 받아 둔다
  coord: raw.coord ?? null,

  /* [사진 지수용] 해가 뜨고 지는 시각과 하늘 상태
     sunrise/sunset 은 UTC 초, timezone 은 그 도시의 UTC 오프셋(초)이다.
     둘을 더해야 그 도시의 현지 시각이 된다. 서울만 보면 티가 안 나지만
     도시를 늘리면 바로 어긋나므로 처음부터 오프셋을 같이 들고 다닌다. */
  sunrise: raw.sys?.sunrise ?? null,
  sunset: raw.sys?.sunset ?? null,
  timezone: raw.timezone ?? 0,
  clouds: raw.clouds?.all ?? null,
  observation: {
    ...base.observation,
    pressure: raw.main.pressure,
    visibility: raw.visibility ? Math.round(raw.visibility / 1000) : base.observation.visibility,
  },
  isLive: true,
})
