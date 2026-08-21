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
export const toCityShape = (raw, base) => ({
  ...base,
  temp: Math.round(raw.main.temp),
  feelsLike: Math.round(raw.main.feels_like),
  humidity: raw.main.humidity,
  wind: Number(raw.wind.speed.toFixed(1)),
  status: raw.weather?.[0]?.description ?? base.status,
  icon: raw.weather?.[0]?.icon ?? null,
  observation: {
    ...base.observation,
    pressure: raw.main.pressure,
    visibility: raw.visibility ? Math.round(raw.visibility / 1000) : base.observation.visibility,
  },
  isLive: true,
})
