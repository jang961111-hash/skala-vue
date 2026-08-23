/**
 * ================================================================
 * useVentilation.js — 환기 지수
 * ================================================================
 * 원래 이 계산은 weatherStore 안에 있었다.
 * 사진 지수(usePhotoTime)를 만들고 나서 보니 두 지수가 같은 일을 하고 있었다.
 *
 *   · 100점에서 조건별로 깎고 더한다
 *   · 0~100 을 넘지 않게 자른다
 *   · 점수를 등급으로 바꾼다
 *   · 왜 그 점수인지 근거를 같이 넘긴다
 *
 * 그래서 공통 규칙을 useWeatherScore 로 빼고, 환기 지수도 스토어에서
 * 여기로 옮겼다. **스토어는 데이터를 들고 있고, 계산은 컴포저블이 한다**
 * 로 역할을 나눈 것이다.
 *
 * 옮기고 나서 스토어가 292줄에서 줄었고, 등급 표를 화면에서 따로
 * 정의하던 중복(ventGrade)도 없앴다.
 *
 * ▸ 점수 (100점 만점)
 *     감점  미세먼지  pm25 × 2       최대 50   환기의 핵심 변수
 *     감점  강수확률  pop × 0.25     최대 25   비 오면 창문을 못 연다
 *     감점  기온차    |temp-22| ×1.5 최대 25  너무 춥거나 더우면 부담
 *     가점  바람      min(wind×3,10)           약한 바람은 공기를 밀어낸다
 *
 *   가중치는 내가 정한 것이라 절대 기준이 아니다.
 *   대신 점수 옆에 항목별 근거를 같이 보여준다.
 * ================================================================
 */
import { buildScore, scoreGrade } from './useWeatherScore.js'

/**
 * 예보 한 건의 환기 점수.
 * 대기질 예보가 없는 시간대는 null 을 돌려준다 — 없는 값을 추측해서
 * 점수를 매기면 그 점수가 거짓말이 된다.
 */
export const scoreVentSlot = (forecastItem, airTable) => {
  const a = airTable?.[forecastItem.utcKey]
  if (!a) return null

  const terms = [
    { key: 'dust', label: '미세먼지', value: -Math.min(a.pm25 * 2, 50) },
    { key: 'rain', label: '강수확률', value: -Math.min(forecastItem.pop * 0.25, 25) },
    { key: 'temp', label: '기온차', value: -Math.min(Math.abs(forecastItem.temp - 22) * 1.5, 25) },
    { key: 'wind', label: '바람', value: Math.min(forecastItem.wind * 3, 10) },
  ]

  const { score, breakdown } = buildScore(terms, 100)
  return {
    ...forecastItem,
    pm25: a.pm25,
    aqi: a.aqi,
    score,
    breakdown,
    grade: scoreGrade(score),
  }
}

/** 예보 전체를 점수화한다 */
export const ventilationSlots = (forecast, airTable) => {
  if (!forecast?.length || !airTable || !Object.keys(airTable).length) return []
  return forecast.map((f) => scoreVentSlot(f, airTable)).filter(Boolean)
}

/**
 * 환기하기 좋은 시간대 — **날짜별로 하나씩** 골라 준다.
 *
 * 처음에는 전체에서 점수 상위 3개를 뽑았는데 셋 다 같은 날이 나왔다.
 * 그 날이 실제로 제일 좋긴 하지만 "오늘은? 내일은?" 에 답을 못 한다.
 * 날짜별 최고 시간대를 주는 쪽이 실제로 쓸 수 있는 정보라고 봤다.
 */
export const bestVentilation = (forecast, airTable, days = 4) => {
  const byDate = {}
  for (const slot of ventilationSlots(forecast, airTable)) {
    const cur = byDate[slot.date]
    if (!cur || slot.score > cur.score) byDate[slot.date] = slot
  }
  return Object.values(byDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, days)
}
