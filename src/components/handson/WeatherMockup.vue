<!--
  ================================================================
  교재 116p | Hands on - Weather Mockup  (과제)
  ================================================================
  SKALA Full-stack Engineering / Frontend-framework: Vue.js
  강병호 강사님 · 2026-08-19 (Day2)

  ▸ 이 컴포넌트에서 쓴 문법은 전부 교재 60p~115p 범위 안입니다.
    (computed / watch 등 Composition API는 117p 이후라 일부러 안 썼습니다)

  ▸ 복기 방법
    아래 [요구사항 N] 블록을 위에서부터 하나씩 읽고,
    "왜?" 주석을 먼저 이해한 뒤 코드를 직접 다시 타이핑해 보세요.
    각 블록마다 "교재 Np" 와 "연습장 참고 파일"을 달아뒀습니다.
    연습장:  cd ~/projects/skala-vue-practice && npm run dev

  ▸ 시각 디자인 이력
    v1(직접 작성) → v2(현재). v2는 세 가지 시안을 나란히 비교한 뒤
    "Dashboard Tile" 방향을 채택한 것입니다. 기능 요구사항 코드는
    v1과 100% 동일하며, 바뀐 것은 <template>의 마크업 배치와
    <style scoped> 뿐입니다.
    비교 프로젝트: ~/projects/skala-vue-compare (localhost:5175)

  ────────────────────────────────────────────────────────────────
  요구사항 대조표
  ────────────────────────────────────────────────────────────────
  [v] 1. 배열 렌더링 (v-for) + :key="item.id"          → 교재 88p
  [v] 2. 조건부 렌더링 (v-if / v-else)                  → 교재 84p
  [v] 3. 양방향 바인딩 및 한글 처리 (:value + @input)   → 교재 106p
  [v] 4. 이벤트 및 수식어 (@click / @click.stop)        → 교재 96p, 102p
  [v] 5. 본인만의 데이터 추가 + Mockup 확장             → 아래 [요구사항 5] 참고
  ================================================================
-->
<script setup>
import { ref } from 'vue'

/* ================================================================
   [디자인 방향 — Variant B]
   "Dashboard Tile" 컨셉: 카드를 통계 위젯처럼 재구성.
   - 헤더에 원형 아이콘 배지, 컨트롤 영역은 필 형태 검색바 + 토글 칩
   - 카드 좌측에 기온 기준 색 바(핫=주황/쿨=하늘색)를 둬 그리드를 훑을 때
     한눈에 더움/선선함이 구분되도록 함
   - 부가 정보(체감/습도/풍속)는 아이콘 칩으로 압축해 카드 높이를 줄임
   - 팔레트는 인디고→시안 그라데이션 축, 라이트/다크 모두 var(--color-*) 사용
   ================================================================ */

/* ================================================================
   [요구사항 1] 배열 렌더링용 데이터  (교재 88p / VForSample.vue)
   ================================================================
   ▸ 왜 ref()로 감싸는가?
     검색·필터·선택 상태가 바뀔 때 화면이 자동으로 다시 그려져야 한다.
     ref로 감싸지 않으면 값은 바뀌어도 화면은 그대로다. (교재 70p)

   ▸ 왜 각 항목에 id가 있는가?
     v-for의 :key에 쓸 "고유값"이 필요하기 때문. (교재 87p)
     이름(name)으로 key를 잡으면 동명 도시가 생기는 순간 깨진다.
     실무에서 백엔드가 주는 JSON도 대부분 이렇게 id를 달고 온다.

   ▸ [요구사항 5] 본인 데이터 추가분
     교재가 준 필드는 id / name / temp / status 4개뿐이다.
     여기에 humidity(습도) · wind(풍속) · feelsLike(체감온도)를 추가하고
     도시도 3개 → 6개로 늘렸다.
   ================================================================ */
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 62, wind: 2.4, feelsLike: 31 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 88, wind: 3.1, feelsLike: 26 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 74, wind: 4.8, feelsLike: 28 },
  { id: 'city_04', name: '강릉', temp: 22, status: '비', humidity: 91, wind: 5.2, feelsLike: 23 },
  { id: 'city_05', name: '제주', temp: 29, status: '맑음', humidity: 70, wind: 6.0, feelsLike: 33 },
  { id: 'city_06', name: '대전', temp: 25, status: '구름', humidity: 66, wind: 1.9, feelsLike: 27 },
])

/* ================================================================
   [요구사항 3] 한글 검색  (교재 106p / VModelBasic.vue 2번 예제)
   ================================================================
   ★ 과제의 함정 ★
     요구사항이 "v-model"이 아니라 ":value, @input"이라고 못박혀 있다.
     v-model을 쓰면 요구사항 위반이다.

   ▸ 왜 하필 :value + @input인가? (한글 처리와 직결)
     v-model은 내부에 "IME 조합(composition) 가드"를 갖고 있다.
     한글은 ㅅ → 서 → 설 처럼 여러 타건이 모여 한 글자가 되는데,
     v-model은 그 조합이 끝날 때까지 변수 갱신을 미룬다.
     즉 "서"를 치는 중에는 변수가 안 바뀐다.
     반면 :value + @input 은 조합 중인 자모까지 실시간으로 잡아낸다.
     → 검색어 자동완성처럼 "치는 즉시" 반응해야 할 때 이 방식을 쓴다.

   ▸ 이 조합이 곧 v-model의 정체다 (교재 106p)
       :value="변수"                 → JS → 화면  (v-bind, 단방향)
       @input="(e) => 변수 = e.target.value"  → 화면 → JS (v-on)
       두 방향을 합쳐야 비로소 양방향이 된다.

   ▸ e.target 이 뭔가? (교재 97p)
     브라우저가 이벤트 발생 시 자동으로 만들어 넘겨주는 Event 객체의 속성.
     "이벤트를 발생시킨 태그" = 여기서는 <input> 자신.
     그래서 e.target.value 가 사용자가 입력한 값이 된다.
   ================================================================ */
// ※ 변수명은 교재 규격을 따랐다. 144p/177p/196p 과제가 이 이름을 그대로 이어받는다.
const searchQuery = ref('')

const handleSearchInput = (e) => {
  searchQuery.value = e.target.value
}

/* ================================================================
   [요구사항 4-a] 카드 클릭 → 상태바 표기  (교재 96p / VOnBasic.vue)
   ================================================================
   ▸ @click="selectCity(item.name)" 처럼 인자를 넘길 때는
     괄호를 붙여서 호출식으로 쓴다.
     인자가 없을 때만 @click="함수명" 처럼 괄호 없이 "참조를 등록"한다.
     (교재 95p 참고사항 - 함수 참조 전달 방식)
   ================================================================ */
const selectedCityInfo = ref('')

const selectCity = (cityName) => {
  selectedCityInfo.value = cityName
}

/* ================================================================
   [요구사항 4-b] 상세보기 → window.alert  (교재 102p / EventModifierSample.vue)
   ================================================================
   ▸ 교재가 그대로 준 함수다. 백틱(`)을 쓴 템플릿 리터럴이며
     ${} 안에 변수를 꽂는다. (교재 12p Modern JavaScript)

   ▸ ★ 핵심: 이 함수를 부르는 버튼에는 반드시 @click.stop 을 붙여야 한다.
     버튼이 카드(부모) 안에 들어 있어서, .stop 이 없으면
     버튼 클릭 → 부모 카드의 @click 까지 연쇄로 터진다 (이벤트 버블링).
     결과: alert 도 뜨고 상태바도 같이 바뀌는 이중 발동.
     .stop 은 내부적으로 e.stopPropagation() 을 대신 호출해 준다.
   ================================================================ */
// 🔜 [교재 196p Weather Router 과제]
//    window.alert 을 제거하고 router.push('/weather/' + id) 로 대체할 예정.
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

/* ================================================================
   [요구사항 5] 본인만의 Mockup 확장
   ================================================================
   추가한 기능
     (1) 검색어로 카드 목록 필터링 (요구사항 3의 입력값을 실제로 활용)
     (2) "비 오는 지역만 보기" 체크박스 필터  → v-model (교재 108p)
     (3) 요약 통계 바 (표시 중인 도시 수 / 평균 기온)
     (4) 검색 결과 없을 때 빈 상태(empty state) 안내
     (5) 날씨 상태별 이모지, 선택된 카드 하이라이트(:class), 기온별 색상(:style)

   ▸ 왜 함수로 만들었나? (중요 — 나중에 개선할 지점)
     원래 이런 "파생 데이터"는 computed() 로 만드는 것이 정석이다.
     computed 는 의존하는 값이 바뀔 때만 다시 계산하고 결과를 캐시한다.
     하지만 computed 는 교재 117p 이후(Composition API) 내용이라
     아직 안 배웠으므로, 여기서는 일반 함수로 대신했다.
     일반 함수는 화면이 다시 그려질 때마다 매번 재실행된다 (비효율).
     → 3일차에 computed 를 배우면 이 부분을 바꿔보면 좋다.
   ================================================================ */
const onlyRainy = ref(false)

// (1)(2) 검색어 + 비 필터를 통과한 목록만 반환
// 🔜 [교재 144p Weather Composition 과제]
//    이 함수는 computed 로 바꾸고 이름도 filteredWeatherList 로 변경할 예정.
//    computed 는 의존 값이 바뀔 때만 재계산 + 캐시하므로 매 렌더링 재실행이 사라진다.
const getFilteredList = () => {
  return weatherList.value.filter((city) => {
    // 검색어가 비어 있으면 전부 통과, 아니면 도시명에 포함되는지 검사
    const matchKeyword = city.name.includes(searchQuery.value.trim())
    // 체크박스가 꺼져 있으면 전부 통과, 켜져 있으면 '비'인 도시만
    const matchRainy = !onlyRainy.value || city.status === '비'
    return matchKeyword && matchRainy
  })
}

// (3) 현재 표시 중인 도시들의 평균 기온 (소수 첫째 자리)
const getAverageTemp = () => {
  const list = getFilteredList()
  if (list.length === 0) return 0
  const sum = list.reduce((acc, city) => acc + city.temp, 0)
  return (sum / list.length).toFixed(1)
}

// (5) 날씨 상태 문자열 → 이모지
const getStatusEmoji = (status) => {
  if (status === '맑음') return '☀️'
  if (status === '비') return '🌧️'
  if (status === '구름') return '☁️'
  return '🌈'
}
</script>

<template>
  <div class="weather-dashboard">
    <header class="dashboard-header">
      <div class="header-icon" aria-hidden="true">🌎</div>
      <div class="header-text">
        <h2>전국 날씨 대시보드</h2>
        <p class="sub">SKALA Vue.js 과제 — 교재 116p Hands on: Weather Mockup</p>
      </div>
    </header>

    <!-- ============================================================
         [요구사항 3] 한글 검색 입력  (:value + @input)
         ------------------------------------------------------------
         v-model 이 아니라 :value 와 @input 을 각각 걸었다는 점에 주의.
         @input 에 넘긴 handleSearchInput 은 괄호 없이 "참조만" 등록했다.
         → 이벤트 객체(e)가 브라우저에 의해 자동으로 첫 인자로 들어온다.
         ============================================================ -->
    <section class="control-panel">
      <div class="search-field">
        <span class="search-icon" aria-hidden="true">🔎</span>
        <label for="citySearch" class="sr-only">도시 이름 검색</label>
        <input
          id="citySearch"
          type="text"
          placeholder="도시 이름으로 검색 (예: 서울, 부산)"
          :value="searchQuery"
          @input="handleSearchInput"
        />
      </div>

      <!-- 입력한 도시명을 그대로 출력 (요구사항 3의 "출력한다" 부분) -->
      <p class="echo">
        입력한 도시명:
        <strong>{{ searchQuery === '' ? '(아직 입력 없음)' : searchQuery }}</strong>
      </p>

      <!-- [요구사항 5-(2)] 여기는 폼 요소이므로 v-model 을 써도 된다 (교재 108p)
           단일 체크박스이므로 ref 초기값은 Boolean(false) -->
      <label class="rainy-toggle">
        <input type="checkbox" v-model="onlyRainy" />
        <span>🌧️ 비 오는 지역만 보기</span>
      </label>
    </section>

    <!-- ============================================================
         [요구사항 4-a] 선택된 도시를 보여주는 상태바
         ------------------------------------------------------------
         v-if / v-else 로 "선택 전 / 선택 후" 두 상태를 갈아 끼운다.
         v-show 가 아니라 v-if 를 쓴 이유: 전환이 잦지 않고,
         v-else 와 짝을 지어야 하는데 v-show 는 v-else 를 못 쓴다. (교재 86p)
         ============================================================ -->
    <section class="selection-banner">
      <p v-if="selectedCityInfo" class="active">
        📍 <strong>{{ selectedCityInfo }}</strong
        >이 선택되었습니다.
      </p>
      <p v-else class="muted">카드를 클릭하면 여기에 선택한 도시가 표시됩니다.</p>
    </section>

    <!-- [요구사항 5-(3)] 요약 통계 바
         {{ }} 안에는 JS 표현식이 들어갈 수 있으므로 함수 호출도 가능하다 (교재 71p) -->
    <section class="stat-row">
      <div class="stat-chip">
        <span class="stat-label">표시 중인 도시</span>
        <span class="stat-value">{{ getFilteredList().length }}<small>곳</small></span>
      </div>
      <div class="stat-chip">
        <span class="stat-label">평균 기온</span>
        <span class="stat-value">{{ getAverageTemp() }}<small>℃</small></span>
      </div>
    </section>

    <!-- ============================================================
         [요구사항 1] v-for 로 카드 반복 출력  + [요구사항 2] v-if 라벨
         ------------------------------------------------------------
         · :key="city.id"  ← 필수. 배열 안 객체이므로 고유 id 를 쓴다 (교재 87p)
         · :class 객체 구문 → 선택된 카드 + 기온 기준 색 바를 함께 부착 (교재 79p)
         · @click → 카드 전체가 클릭 대상 [요구사항 4-a]
         ============================================================ -->
    <section class="card-deck">
      <article
        v-for="city in getFilteredList()"
        :key="city.id"
        class="weather-tile"
        :class="{
          'is-selected': selectedCityInfo === city.name,
          'is-hot': city.temp >= 25,
          'is-cool': city.temp < 25,
        }"
        @click="selectCity(city.name)"
      >
        <div class="tile-head">
          <div class="tile-title">
            <span class="tile-emoji">{{ getStatusEmoji(city.status) }}</span>
            <h3>{{ city.name }}</h3>
          </div>
          <!-- [요구사항 5-(5)] :style 로 기온에 따라 배지 색을 바꾼다 (교재 81p)
               CSS 속성명(background)이 key, JS 표현식이 value -->
          <span class="temp-badge" :style="{ background: city.temp >= 25 ? '#f97316' : '#0ea5e9' }">
            {{ city.temp }}℃
          </span>
        </div>

        <p class="status-text">현재 상태 · {{ city.status }}</p>

        <!-- ▼ [요구사항 2] 조건부 렌더링 — 25도 기준으로 라벨을 갈아 끼운다
             v-if 가 false 면 그 <span> 은 DOM 에서 아예 사라진다.
             (개발자도구로 열어보면 태그 자체가 없는 것을 확인할 수 있다) -->
        <span v-if="city.temp >= 25" class="label label-hot">🔥 더움 (25도 이상)</span>
        <span v-else class="label label-cool">❄️ 선선함 (25도 미만)</span>

        <!-- [요구사항 5-(1)] 본인이 추가한 데이터 표시 -->
        <ul class="chip-row">
          <li class="info-chip">🌡️ 체감 {{ city.feelsLike }}℃</li>
          <li class="info-chip">💧 습도 {{ city.humidity }}%</li>
          <li class="info-chip">💨 풍속 {{ city.wind }}m/s</li>
        </ul>

        <!-- ▼ [요구사항 4-b] 상세보기 버튼
             ★ @click.stop 의 .stop 이 이 과제의 핵심 채점 포인트 ★
             .stop 이 없으면 이 버튼을 눌렀을 때
             부모 <article> 의 @click="selectCity(...)" 까지 같이 실행된다.
             .stop = e.stopPropagation() (교재 101p) -->
        <button type="button" class="detail-btn" @click.stop="showDetail(city.name, city.status)">
          상세보기 <span aria-hidden="true">→</span>
        </button>
      </article>
    </section>

    <!-- [요구사항 5-(4)] 검색 결과가 하나도 없을 때만 나타나는 빈 상태 안내
         getFilteredList().length === 0 이라는 JS 표현식을 v-if 조건으로 썼다 -->
    <p v-if="getFilteredList().length === 0" class="empty">
      <span class="empty-icon" aria-hidden="true">🔍</span>
      조건에 맞는 도시가 없습니다. 검색어나 필터를 확인해 주세요.
    </p>
  </div>
</template>

<style scoped>
/* ================================================================
   교재 113p | scoped 를 붙였으므로 이 CSS 는 이 컴포넌트 안에서만 적용된다.
   scoped 를 빼면 .label / .temp-badge 같은 흔한 클래스명이 전역으로 새어 나가
   다른 컴포넌트를 오염시킨다.
   ================================================================ */
.weather-dashboard {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  line-height: 1.6;
  color: var(--color-text, inherit);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.dashboard-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.header-icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  box-shadow: 0 6px 16px rgba(6, 182, 212, 0.28);
}

.header-text h2 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.header-text .sub {
  font-size: 0.82rem;
  opacity: 0.6;
  margin-top: 2px;
}

.control-panel {
  margin: 4px 0 18px;
  padding: 18px 20px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
}

.search-field {
  position: relative;
  max-width: 360px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.95rem;
  opacity: 0.55;
  pointer-events: none;
}

.search-field input[type='text'] {
  width: 100%;
  padding: 10px 14px 10px 38px;
  font-size: 0.95rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  outline-offset: 2px;
}

.search-field input[type='text']:focus-visible {
  outline: 2px solid #6366f1;
}

.echo {
  margin-top: 10px;
  font-size: 0.85rem;
  opacity: 0.85;
}

.rainy-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  cursor: pointer;
}

.rainy-toggle input[type='checkbox'] {
  accent-color: #06b6d4;
}

.selection-banner {
  padding: 10px 16px;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08));
  border: 1px solid rgba(6, 182, 212, 0.25);
  margin-bottom: 14px;
  font-size: 0.92rem;
}

.selection-banner .muted {
  opacity: 0.6;
}

.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.stat-chip {
  flex: 1 1 160px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.6;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #06b6d4;
}

.stat-value small {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.7;
  margin-left: 2px;
}

.card-deck {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.weather-tile {
  position: relative;
  padding: 16px 18px 16px 20px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  border-left: 4px solid transparent;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.weather-tile.is-hot {
  border-left-color: #f97316;
}

.weather-tile.is-cool {
  border-left-color: #0ea5e9;
}

.weather-tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

/* :class 객체 구문으로 선택된 카드에만 붙는 클래스 */
.weather-tile.is-selected {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.35);
}

.tile-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.tile-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tile-emoji {
  font-size: 1.15rem;
}

.tile-title h3 {
  font-size: 1.05rem;
  font-weight: 700;
}

.temp-badge {
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}

.status-text {
  font-size: 0.85rem;
  opacity: 0.7;
  margin: 6px 0 8px;
}

.label {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}

.label-hot {
  background: rgba(249, 115, 22, 0.15);
  color: #c2410c;
}

.label-cool {
  background: rgba(14, 165, 233, 0.15);
  color: #0369a1;
}

.chip-row {
  list-style: none;
  padding: 0;
  margin: 12px 0 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.info-chip {
  padding: 3px 9px;
  font-size: 0.75rem;
  border-radius: 8px;
  background: rgba(148, 163, 184, 0.15);
  opacity: 0.85;
}

.detail-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6366f1;
  background: transparent;
  border: 1.5px solid #6366f1;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.detail-btn:hover {
  background: #6366f1;
  color: #fff;
}

.empty {
  margin-top: 24px;
  padding: 24px 16px;
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: 14px;
  opacity: 0.75;
}

.empty-icon {
  display: block;
  font-size: 1.6rem;
  margin-bottom: 6px;
}

@media (max-width: 560px) {
  .card-deck {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    align-items: flex-start;
  }
}
</style>
