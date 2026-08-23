/**
 * ================================================================
 * 교재 212p | configStore — 날씨 단위 설정 스토어
 * ================================================================
 * ▸ 요구사항에 명시된 3요소
 *     state    unit        단위 저장 변수 (초기값 'celsius')
 *     getters  unitSymbol  현재 단위에 맞는 기호 (℃ / ℉)
 *     actions  toggleUnit  'celsius' ↔ 'fahrenheit' 토글
 *
 * ▸ 왜 스토어여야 하는가 (196p 에서 만든 문제의 답)
 *     단위 설정은 **네비게이션 바**에서 바꾸는데,
 *     그 값을 써야 하는 곳은 **대시보드 카드**와 **상세 페이지**다.
 *     셋은 부모-자식이 아니다. 라우터로 갈린 남남이다.
 *       · props   → 못 넘긴다 (부모-자식이 아니므로)
 *       · provide → App.vue 에서 내려줄 수는 있으나 추적이 어렵다
 *       · 스토어   → 어디서든 import 해서 쓴다  ← 이것
 *
 * ▸ Pinia 3요소는 Vue 문법 그대로다 (교재 203p)
 *     ref()      → state
 *     computed() → getters
 *     일반 함수   → actions
 *     return {}  → Expose (외부에 열어줄 것만 골라서 내보낸다)
 * ================================================================
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 식별자 규칙: use + 파일명 + Store (교재 203p)
export const useConfigStore = defineStore('config', () => {
  /* ── state ── */
  const unit = ref('celsius')

  // [요구사항 4] 본인 추가 state — 카드 조밀 보기
  const compact = ref(false)

  /* ================================================================
     테마 (라이트 / 다크 / 시스템)
     ================================================================
     ▸ 왜 스토어에 두나
       테마는 헤더의 버튼에서 바꾸는데, 색을 쓰는 건 앱 전체다.
       단위(℃/℉) 를 스토어로 뺀 것과 정확히 같은 이유다 — props 로
       내려보낼 수 없는 값이다.

     ▸ 세 가지 상태로 둔 이유
       'system' 이 기본이다. 사용자가 OS 에서 이미 정해 둔 취향을
       무시하고 강제로 밝게 켜는 앱이 불편했던 기억이 있어서,
       **명시적으로 고르기 전까지는 OS 를 따라간다.**

     ▸ localStorage
       새로고침해도 유지돼야 설정으로서 의미가 있다.
       읽기가 실패할 수 있어(사파리 프라이빗 모드 등) try/catch 로 감싼다.
       실패하면 그냥 기본값으로 간다 — 테마 때문에 앱이 죽으면 안 된다.
     ================================================================ */
  const THEME_KEY = 'skala-vue-theme'
  const THEMES = ['system', 'light', 'dark']

  const readStoredTheme = () => {
    try {
      const saved = localStorage.getItem(THEME_KEY)
      return THEMES.includes(saved) ? saved : 'system'
    } catch {
      return 'system'
    }
  }

  const theme = ref(readStoredTheme())

  const themeLabel = computed(
    () => ({ system: '시스템', light: '라이트', dark: '다크' })[theme.value],
  )

  const themeIcon = computed(() => ({ system: '🖥️', light: '☀️', dark: '🌙' })[theme.value])

  /**
   * html 태그에 data-theme 를 붙인다.
   * CSS 쪽에서 :root[data-theme='dark'] 가 미디어쿼리를 덮어쓴다.
   * 'system' 일 때는 속성을 아예 지워서 미디어쿼리에 다시 맡긴다.
   */
  const applyTheme = () => {
    const el = document.documentElement
    if (theme.value === 'system') el.removeAttribute('data-theme')
    else el.setAttribute('data-theme', theme.value)
    try {
      localStorage.setItem(THEME_KEY, theme.value)
    } catch {
      // 저장이 안 돼도 이번 세션 동안은 동작한다
    }
  }

  /** 시스템 → 라이트 → 다크 → 시스템 순으로 돈다 */
  const cycleTheme = () => {
    const i = THEMES.indexOf(theme.value)
    theme.value = THEMES[(i + 1) % THEMES.length]
    applyTheme()
  }

  // 스토어가 처음 만들어질 때 저장된 값을 화면에 반영한다
  applyTheme()

  /* ── getters ── */
  const unitSymbol = computed(() => (unit.value === 'fahrenheit' ? '℉' : '℃'))

  // [요구사항 4] 본인 추가 getter — 화면에 표기할 한글 라벨
  const unitLabel = computed(() => (unit.value === 'fahrenheit' ? '화씨' : '섭씨'))

  /* ── actions ── */
  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
    console.log(`[configStore] 단위 변경 → ${unit.value}`)
  }

  // [요구사항 4] 본인 추가 action — 특정 단위로 직접 지정
  const setUnit = (next) => {
    if (next === 'celsius' || next === 'fahrenheit') unit.value = next
  }

  const toggleCompact = () => {
    compact.value = !compact.value
  }

  /**
   * [요구사항 4] 본인 추가 action — 섭씨 원본값을 현재 단위로 변환
   *
   * 교재 212p 참고사항: 메인/상세에 같은 변환 코드가 중복된다.
   * 교재는 "Composable 로 해결 가능(범위 제외)" 이라 했는데,
   * 변환 자체는 상태에만 의존하므로 **스토어의 action 으로 올리면**
   * Composable 없이도 중복이 사라진다.
   * → 이 앱에서는 WeatherCard 와 WeatherDetailView 가 이 함수 하나를 공유한다.
   */
  const convertTemp = (celsiusValue) => {
    if (unit.value === 'fahrenheit') {
      return Math.round((celsiusValue * 9) / 5 + 32)
    }
    return celsiusValue
  }

  /* ── Expose: 외부에 열어줄 것만 반환한다 ── */
  return {
    unit,
    compact,
    unitSymbol,
    unitLabel,
    toggleUnit,
    setUnit,
    toggleCompact,
    convertTemp,
    theme,
    themeLabel,
    themeIcon,
    cycleTheme,
  }
})
