/**
 * ================================================================
 * useWeatherScore.js — 지수 계산 공통 규칙
 * ================================================================
 * 이 파일을 따로 뺀 이유
 *
 *   환기 지수를 만들고 사진 지수를 붙이려니, 두 지수가 같은 일을 하고 있었다.
 *     · 100점에서 조건별로 깎고 더한다
 *     · 0~100 범위를 넘지 않게 자른다
 *     · 점수를 사람이 읽는 등급으로 바꾼다
 *     · 왜 그 점수인지 근거를 같이 넘긴다
 *
 *   컴포넌트마다 복사하면 나중에 기준을 바꿀 때 여러 곳을 고쳐야 한다.
 *   교재 Composition API 단원에서 배운 것이 결국 **로직 재사용**이라,
 *   화면에 묶이지 않는 계산은 이렇게 밖으로 빼는 게 맞다고 봤다.
 *
 * ▸ 여기에는 ref 가 없다
 *   반응형 상태를 들고 있지 않고 계산만 한다. 그래서 use 로 시작하지만
 *   실제로는 순수 함수 묶음이다. 스토어에서도, 컴포넌트에서도 쓸 수 있다.
 * ================================================================
 */

/** 0~100 범위로 자른다. 감점이 과해도 음수가 나오지 않게. */
export const clampScore = (n) => Math.max(0, Math.min(100, Math.round(n)))

/**
 * 감점·가점 목록을 받아 점수와 근거를 같이 돌려준다.
 *
 * 점수만 주면 "왜 71점인지" 알 수 없다. 화면에서 근거를 보여주려면
 * 항목별 값이 필요해서 breakdown 을 함께 반환한다.
 *
 * @param {Array<{key:string,label:string,value:number}>} terms
 *        value 가 음수면 감점, 양수면 가점
 */
export const buildScore = (terms, base = 100) => {
  const total = terms.reduce((acc, t) => acc + t.value, base)
  return {
    score: clampScore(total),
    breakdown: terms.map((t) => ({ ...t, value: Math.round(t.value) })),
  }
}

/**
 * 한 값이 "적정 구간"에 얼마나 가까운지를 0~1 로 돌려준다.
 *
 * 낮을수록 좋은 값(미세먼지)과 달리, 구름량처럼 **너무 적어도 너무 많아도
 * 안 좋은** 값이 있다. 그런 항목을 위해 만들었다.
 *
 *   sweetSpot(38, 20, 60) → 1    (구간 안)
 *   sweetSpot(0,  20, 60) → 0.0  (구간에서 멀다)
 */
export const sweetSpot = (value, min, max, falloff = 40) => {
  if (value === null || value === undefined) return 0
  if (value >= min && value <= max) return 1
  const dist = value < min ? min - value : value - max
  return Math.max(0, 1 - dist / falloff)
}

/** 점수를 사람이 읽는 등급으로. 두 지수가 같은 척도를 쓰도록 한곳에 둔다. */
export const scoreGrade = (score) => {
  if (score >= 80) return { label: '아주 좋음', cls: 'g1' }
  if (score >= 65) return { label: '좋음', cls: 'g2' }
  if (score >= 50) return { label: '보통', cls: 'g3' }
  if (score >= 35) return { label: '아쉬움', cls: 'g4' }
  return { label: '나쁨', cls: 'g5' }
}
