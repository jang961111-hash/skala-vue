<!--
  ============================================================
  교재 220·224p | Axios Weather Example (OpenWeatherMap)
  ============================================================
  ⚠️ 이 실습은 **본인의 API 키**가 있어야 동작한다.
     교재 224p 에는 강사님 키가 인쇄돼 있지만, 남의 키를 쓰지 않는다.

  [키 준비]
    1. https://openweathermap.org/ 가입
    2. My API keys 에서 키 복사
    3. 아래 입력창에 붙여넣기 (이 페이지 안에서만 쓰이고 저장되지 않는다)
       ※ 제출 저장소에서는 .env.local 로 관리한다

  ▸ 호출 주소 (교재 220p)
      https://api.openweathermap.org/data/2.5/weather
        ?q={영문도시명}&appid={KEY}&units=metric&lang=kr

      units=metric  섭씨로 받는다 (기본값은 켈빈)
      lang=kr       날씨 설명을 한글로 받는다

  ▸ Axios 의 이점 (교재 222p)
      response.data 가 이미 JSON 객체다. fetch 처럼 .json() 을 부를 필요가 없다.
      4xx/5xx 는 자동 reject → catch 로 떨어진다.

  ▸ 자주 만나는 에러
      401  키가 틀렸거나 **아직 활성화 전** (발급 후 최대 2시간)
      404  도시명을 못 찾음 (한글 대신 영문으로)
      429  무료 등급 호출 한도 초과
  ============================================================
-->
<script setup>
import { ref } from 'vue'
import axios from 'axios'

const apiKey = ref('')
const cityInput = ref('Seoul')
const weatherData = ref(null)
const isLoading = ref(false)
const errorText = ref('')

const handleFetchWeather = async () => {
  if (!apiKey.value.trim()) {
    errorText.value = 'API 키를 먼저 입력하세요.'
    return
  }

  isLoading.value = true
  errorText.value = ''
  weatherData.value = null

  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey.value.trim()}&units=metric&lang=kr`

  try {
    // 비동기 통신: 서버에서 데이터를 다 가져올 때까지 await 로 기다린다
    const response = await axios.get(URL)
    // Axios 는 응답 문자열을 자동으로 JSON 파싱해 준다
    console.log('Axios 통신 응답 전체 객체:', response)
    console.log('백엔드가 준 핵심 날씨 데이터(JSON):', response.data)
    weatherData.value = response.data
  } catch (error) {
    // 4xx, 5xx 에러나 네트워크 오프라인 시 자동으로 reject 되어 여기로 온다
    const status = error.response?.status
    errorText.value =
      status === 401
        ? '401 — 키가 틀렸거나 아직 활성화 전입니다 (발급 후 최대 2시간).'
        : status === 404
          ? '404 — 도시를 찾지 못했습니다. 영문 도시명으로 시도하세요.'
          : status === 429
            ? '429 — 무료 등급 호출 한도를 초과했습니다.'
            : `통신 실패 — ${error.message}`
    console.error('통신 중 에러가 발생했습니다:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>Axios Weather Example (OpenWeatherMap)</h2>

    <div class="key-box">
      <label>API 키</label>
      <input
        v-model="apiKey"
        type="password"
        placeholder="본인 키를 붙여넣으세요 (저장되지 않습니다)"
      />
      <small>
        키가 없으면
        <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
          openweathermap.org</a
        >
        에서 가입 후 발급받으세요. 발급 직후에는 활성화까지 최대 2시간 걸립니다.
      </small>
    </div>

    <div class="toolbar">
      <input
        v-model="cityInput"
        placeholder="영문 도시명 (예: Seoul)"
        @keyup.enter="handleFetchWeather"
      />
      <button :disabled="isLoading" @click="handleFetchWeather">
        {{ isLoading ? '불러오는 중…' : '날씨 조회' }}
      </button>
    </div>

    <p v-if="errorText" class="err">{{ errorText }}</p>

    <div v-if="weatherData" class="result">
      <h3>{{ weatherData.name }}</h3>
      <p class="big">{{ Math.round(weatherData.main.temp) }}℃</p>
      <p class="desc">{{ weatherData.weather[0].description }}</p>
      <ul>
        <li>체감 {{ Math.round(weatherData.main.feels_like) }}℃</li>
        <li>습도 {{ weatherData.main.humidity }}%</li>
        <li>풍속 {{ weatherData.wind.speed }}m/s</li>
        <li>기압 {{ weatherData.main.pressure }}hPa</li>
      </ul>
      <details>
        <summary>원본 응답(JSON) 보기</summary>
        <pre>{{ JSON.stringify(weatherData, null, 2) }}</pre>
      </details>
    </div>

    <p class="hint">
      ※ 교수님 권장: 코드를 짜기 전에 <b>Postman</b> 으로 먼저 호출해 보세요. 응답 JSON 을 눈으로
      확인하면 내 코드가 잘못된 건지 API 가 잘못된 건지 구분할 수 있습니다. (교재 221p)
    </p>
  </div>
</template>

<style scoped>
.key-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 12px;
}
.key-box label {
  font-size: 0.78rem;
  font-weight: 600;
  opacity: 0.75;
}
.key-box small {
  font-size: 0.74rem;
  opacity: 0.7;
}
.toolbar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.toolbar input {
  flex: 1 1 180px;
}
.err {
  padding: 9px 13px;
  border-left: 3px solid #e74c3c;
  background: rgba(231, 76, 60, 0.08);
  border-radius: 0 6px 6px 0;
  font-size: 0.85rem;
  margin-bottom: 12px;
}
.result {
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}
.result h3 {
  font-size: 1.05rem;
  font-weight: 700;
}
.big {
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.1;
}
.desc {
  opacity: 0.8;
  margin-bottom: 8px;
}
.result ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.82rem;
}
.result li {
  padding: 3px 10px;
  border-radius: 6px;
  background: rgba(127, 127, 127, 0.12);
}
details {
  margin-top: 12px;
  font-size: 0.78rem;
}
pre {
  max-height: 220px;
  overflow: auto;
  padding: 10px;
  border-radius: 6px;
  background: rgba(127, 127, 127, 0.1);
  font-size: 0.72rem;
}
.hint {
  margin-top: 12px;
  font-size: 0.78rem;
  opacity: 0.65;
}
</style>
