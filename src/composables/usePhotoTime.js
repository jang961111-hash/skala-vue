/**
 * ================================================================
 * usePhotoTime.js — 사진 찍기 좋은 시간
 * ================================================================
 * 앱 주제를 여기에 맞췄다. 날씨를 나열하는 대신 **판단**을 준다.
 *
 * ▸ 왜 이 주제인가
 *   날씨 앱은 이미 많고, 기온과 강수확률은 어디서나 본다.
 *   그런데 "언제 나가서 찍어야 하나"는 기온만으로는 답이 안 나온다.
 *   해가 뜨고 지는 시각, 구름량, 미세먼지를 같이 봐야 한다.
 *   API 세 종류를 합쳐야 나오는 답이라 이 앱에서만 할 수 있다.
 *
 * ▸ 골든아워 / 블루아워
 *   골든아워 — 해 뜬 직후 1시간, 해 지기 전 1시간.
 *              빛이 낮게 깔려 색이 따뜻해지고 그림자가 길어진다.
 *   블루아워 — 해 뜨기 전 30분, 해 진 뒤 30분.
 *              하늘이 짙은 파랑이 되는 짧은 구간. 야경과 같이 찍기 좋다.
 *
 * ▸ 구름은 적을수록 좋은 게 아니다
 *   완전히 맑으면(0%) 하늘이 밋밋하다. 빛을 받아줄 게 없어서 노을이 안 산다.
 *   반대로 100% 면 해가 아예 안 보인다.
 *   실제로 잘 나오는 구간은 20~60% 라 sweetSpot 으로 계산했다.
 *   "낮을수록 좋다"가 아닌 항목이 있다는 걸 이 지수를 만들며 알았다.
 *
 * ▸ 한계 (알고 남긴다)
 *   날씨 예보가 3시간 간격이라 골든아워 시각과 정확히 안 맞는다.
 *   19:15 일몰이면 18:00 예보를 쓴다. 그 사이 하늘이 바뀌면 빗나간다.
 *   1시간 간격 예보는 유료 플랜이라 무료 범위에서는 여기까지다.
 * ================================================================
 */
import { buildScore, sweetSpot, scoreGrade } from './useWeatherScore.js'

const HOUR = 3600
const MIN = 60

/** UTC 초 + 도시 오프셋 → 그 도시의 'HH:MM' */
export const toLocalHM = (utcSec, tzOffsetSec) => {
  if (utcSec === null || utcSec === undefined) return '--:--'
  const d = new Date((utcSec + tzOffsetSec) * 1000)
  return d.toISOString().slice(11, 16)
}

/** UTC 초 + 오프셋 → 그 도시의 'MM-DD' */
export const toLocalMD = (utcSec, tzOffsetSec) => {
  if (utcSec === null || utcSec === undefined) return ''
  return new Date((utcSec + tzOffsetSec) * 1000).toISOString().slice(5, 10)
}

/**
 * 하루치 촬영 구간 4개를 만든다.
 * 날짜별로 일출·일몰이 조금씩 달라지지만, 무료 API 는 오늘 값만 준다.
 * 그래서 하루에 약 4분씩 밀리는 것을 근사해서 다음 날들을 추정한다.
 */
export const buildSlots = (city, dayOffset = 0) => {
  if (!city?.sunrise || !city?.sunset) return []
  // 8월 기준 한국은 하루에 일출이 약 +1분, 일몰이 약 -1분 이동한다.
  const rise = city.sunrise + dayOffset * (86400 + 60)
  const set = city.sunset + dayOffset * (86400 - 60)
  return [
    { key: 'blue-am', name: '새벽 블루아워', from: rise - 30 * MIN, to: rise, icon: '🌌' },
    { key: 'gold-am', name: '아침 골든아워', from: rise, to: rise + HOUR, icon: '🌅' },
    { key: 'gold-pm', name: '저녁 골든아워', from: set - HOUR, to: set, icon: '🌇' },
    { key: 'blue-pm', name: '저녁 블루아워', from: set, to: set + 30 * MIN, icon: '🌃' },
  ]
}

/** 예보 40건 중 그 시각에 가장 가까운 것을 고른다 (3시간 간격의 한계) */
const nearestForecast = (forecast, utcSec) => {
  let best = null
  let gap = Infinity
  for (const f of forecast) {
    if (f.dt === null || f.dt === undefined) continue
    const d = Math.abs(f.dt - utcSec)
    if (d < gap) {
      gap = d
      best = f
    }
  }
  // 3시간(10800초)보다 더 떨어졌으면 그 구간은 판단하지 않는다
  return gap <= 3 * HOUR ? best : null
}

/**
 * 촬영 구간 하나의 점수를 낸다.
 *
 *   가점  구름   sweetSpot(20~60%) × 30   하늘에 그림이 생긴다
 *   감점  미세   pm25 × 1.2  최대 35      뿌옇게 날아간다
 *   감점  비     pop × 0.3   최대 30      장비를 못 꺼낸다
 *   가점  구간   골든 +10 / 블루 +5       빛 자체가 다르다
 */
export const scoreSlot = (slot, forecast, airTable) => {
  const mid = Math.round((slot.from + slot.to) / 2)
  const f = nearestForecast(forecast, mid)
  if (!f) return null

  const airKey = new Date(mid * 1000).toISOString().slice(0, 13)
  const air = airTable?.[airKey] ?? null
  const pm25 = air?.pm25 ?? null

  const terms = [
    { key: 'cloud', label: '구름', value: sweetSpot(f.clouds, 20, 60) * 30 - 15 },
    { key: 'dust', label: '미세먼지', value: pm25 === null ? 0 : -Math.min(pm25 * 1.2, 35) },
    { key: 'rain', label: '강수확률', value: -Math.min(f.pop * 0.3, 30) },
    { key: 'light', label: '빛', value: slot.key.startsWith('gold') ? 10 : 5 },
  ]

  const { score, breakdown } = buildScore(terms, 85)
  return {
    ...slot,
    score,
    breakdown,
    grade: scoreGrade(score),
    clouds: f.clouds,
    pop: f.pop,
    pm25,
    // 예보가 실제로 얼마나 떨어져 있는지도 남긴다 (한계를 감추지 않는다)
    forecastGapMin: Math.round(Math.abs(f.dt - mid) / 60),
  }
}

/** 도시 하나의 촬영 추천 — 오늘부터 days 일치 */
export const photoPlan = (city, forecast, airTable, days = 3) => {
  const out = []
  for (let d = 0; d < days; d++) {
    for (const slot of buildSlots(city, d)) {
      const scored = scoreSlot(slot, forecast, airTable)
      if (scored) out.push({ ...scored, dayOffset: d })
    }
  }
  return out
}
