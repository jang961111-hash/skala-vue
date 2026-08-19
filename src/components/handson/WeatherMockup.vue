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
const searchKeyword = ref('')

const handleSearchInput = (e) => {
  searchKeyword.value = e.target.value
}

/* ================================================================
   [요구사항 4-a] 카드 클릭 → 상태바 표기  (교재 96p / VOnBasic.vue)
   ================================================================
   ▸ @click="selectCity(item.name)" 처럼 인자를 넘길 때는
     괄호를 붙여서 호출식으로 쓴다.
     인자가 없을 때만 @click="함수명" 처럼 괄호 없이 "참조를 등록"한다.
     (교재 95p 참고사항 - 함수 참조 전달 방식)
   ================================================================ */
const selectedCity = ref('')

const selectCity = (cityName) => {
  selectedCity.value = cityName
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
const getFilteredList = () => {
  return weatherList.value.filter((city) => {
    // 검색어가 비어 있으면 전부 통과, 아니면 도시명에 포함되는지 검사
    const matchKeyword = city.name.includes(searchKeyword.value.trim())
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
  <div class="weather-mockup">
    <header class="page-head">
      <h2>🌤️ 전국 날씨 현황</h2>
      <p class="sub">SKALA Vue.js 과제 — 교재 116p Hands on: Weather Mockup</p>
    </header>

    <!-- ============================================================
         [요구사항 3] 한글 검색 입력  (:value + @input)
         ------------------------------------------------------------
         v-model 이 아니라 :value 와 @input 을 각각 걸었다는 점에 주의.
         @input 에 넘긴 handleSearchInput 은 괄호 없이 "참조만" 등록했다.
         → 이벤트 객체(e)가 브라우저에 의해 자동으로 첫 인자로 들어온다.
         ============================================================ -->
    <section class="search-box">
      <label for="citySearch">도시 이름 검색 (한글)</label>
      <input
        id="citySearch"
        type="text"
        placeholder="예) 서울, 부산"
        :value="searchKeyword"
        @input="handleSearchInput"
      />
      <!-- 입력한 도시명을 그대로 출력 (요구사항 3의 "출력한다" 부분) -->
      <p class="echo">
        입력한 도시명:
        <strong>{{ searchKeyword === '' ? '(아직 입력 없음)' : searchKeyword }}</strong>
      </p>

      <!-- [요구사항 5-(2)] 여기는 폼 요소이므로 v-model 을 써도 된다 (교재 108p)
           단일 체크박스이므로 ref 초기값은 Boolean(false) -->
      <label class="rainy-toggle">
        <input type="checkbox" v-model="onlyRainy" />
        비 오는 지역만 보기
      </label>
    </section>

    <!-- ============================================================
         [요구사항 4-a] 선택된 도시를 보여주는 상태바
         ------------------------------------------------------------
         v-if / v-else 로 "선택 전 / 선택 후" 두 상태를 갈아 끼운다.
         v-show 가 아니라 v-if 를 쓴 이유: 전환이 잦지 않고,
         v-else 와 짝을 지어야 하는데 v-show 는 v-else 를 못 쓴다. (교재 86p)
         ============================================================ -->
    <section class="status-bar">
      <p v-if="selectedCity">
        ✅ <strong>{{ selectedCity }}</strong
        >이 선택되었습니다.
      </p>
      <p v-else class="muted">카드를 클릭하면 여기에 선택한 도시가 표시됩니다.</p>
    </section>

    <!-- [요구사항 5-(3)] 요약 통계 바
         {{ }} 안에는 JS 표현식이 들어갈 수 있으므로 함수 호출도 가능하다 (교재 71p) -->
    <section class="summary">
      <span
        >표시 중인 도시: <strong>{{ getFilteredList().length }}</strong
        >곳</span
      >
      <span
        >평균 기온: <strong>{{ getAverageTemp() }}</strong
        >℃</span
      >
    </section>

    <!-- ============================================================
         [요구사항 1] v-for 로 카드 반복 출력  + [요구사항 2] v-if 라벨
         ------------------------------------------------------------
         · :key="city.id"  ← 필수. 배열 안 객체이므로 고유 id 를 쓴다 (교재 87p)
         · :class 객체 구문 → 선택된 카드만 'is-selected' 클래스 부착 (교재 79p)
         · @click → 카드 전체가 클릭 대상 [요구사항 4-a]
         ============================================================ -->
    <section class="card-grid">
      <article
        v-for="city in getFilteredList()"
        :key="city.id"
        class="weather-card"
        :class="{ 'is-selected': selectedCity === city.name }"
        @click="selectCity(city.name)"
      >
        <div class="card-head">
          <h3>{{ getStatusEmoji(city.status) }} {{ city.name }}</h3>
          <!-- [요구사항 5-(5)] :style 로 기온에 따라 숫자 색을 바꾼다 (교재 81p)
               CSS 속성명(color)이 key, JS 표현식이 value -->
          <span class="temp" :style="{ color: city.temp >= 25 ? '#e74c3c' : '#3498db' }">
            {{ city.temp }}℃
          </span>
        </div>

        <p class="status-text">현재 상태: {{ city.status }}</p>

        <!-- ▼ [요구사항 2] 조건부 렌더링 — 25도 기준으로 라벨을 갈아 끼운다
             v-if 가 false 면 그 <span> 은 DOM 에서 아예 사라진다.
             (개발자도구로 열어보면 태그 자체가 없는 것을 확인할 수 있다) -->
        <span v-if="city.temp >= 25" class="label label-hot">🔥 더움 (25도 이상)</span>
        <span v-else class="label label-cool">❄️ 선선함 (25도 미만)</span>

        <!-- [요구사항 5-(1)] 본인이 추가한 데이터 표시 -->
        <ul class="extra">
          <li>체감온도 {{ city.feelsLike }}℃</li>
          <li>습도 {{ city.humidity }}%</li>
          <li>풍속 {{ city.wind }}m/s</li>
        </ul>

        <!-- ▼ [요구사항 4-b] 상세보기 버튼
             ★ @click.stop 의 .stop 이 이 과제의 핵심 채점 포인트 ★
             .stop 이 없으면 이 버튼을 눌렀을 때
             부모 <article> 의 @click="selectCity(...)" 까지 같이 실행된다.
             .stop = e.stopPropagation() (교재 101p) -->
        <button type="button" class="detail-btn" @click.stop="showDetail(city.name, city.status)">
          상세보기
        </button>
      </article>
    </section>

    <!-- [요구사항 5-(4)] 검색 결과가 하나도 없을 때만 나타나는 빈 상태 안내
         getFilteredList().length === 0 이라는 JS 표현식을 v-if 조건으로 썼다 -->
    <p v-if="getFilteredList().length === 0" class="empty">
      🔍 조건에 맞는 도시가 없습니다. 검색어나 필터를 확인해 주세요.
    </p>
  </div>
</template>

<style scoped>
/* ================================================================
   교재 113p | scoped 를 붙였으므로 이 CSS 는 이 컴포넌트 안에서만 적용된다.
   scoped 를 빼면 .label / .temp 같은 흔한 클래스명이 전역으로 새어 나가
   다른 컴포넌트를 오염시킨다.
   ================================================================ */
.weather-mockup {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  line-height: 1.6;
}

.page-head h2 {
  font-size: 1.7rem;
  font-weight: 700;
}

.page-head .sub {
  font-size: 0.85rem;
  opacity: 0.65;
  margin-top: 4px;
}

.search-box {
  margin: 24px 0 16px;
  padding: 16px 18px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.search-box label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.search-box input[type='text'] {
  width: 100%;
  max-width: 320px;
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #999;
  border-radius: 6px;
  background: transparent;
  color: inherit;
}

.echo {
  margin-top: 8px;
  font-size: 0.9rem;
}

.rainy-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-weight: 400;
  cursor: pointer;
}

.status-bar {
  padding: 10px 16px;
  border-left: 4px solid #42b883;
  background: rgba(66, 184, 131, 0.1);
  border-radius: 4px;
  margin-bottom: 14px;
}

.status-bar .muted {
  opacity: 0.6;
}

.summary {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 16px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.weather-card {
  padding: 16px 18px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.weather-card:hover {
  border-color: #42b883;
  transform: translateY(-2px);
}

/* :class 객체 구문으로 선택된 카드에만 붙는 클래스 */
.weather-card.is-selected {
  border-color: #42b883;
  border-width: 2px;
  background: rgba(66, 184, 131, 0.08);
}

.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.card-head h3 {
  font-size: 1.1rem;
  font-weight: 700;
}

.temp {
  font-size: 1.25rem;
  font-weight: 700;
}

.status-text {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 4px 0 8px;
}

.label {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.label-hot {
  background: rgba(231, 76, 60, 0.15);
  color: #c0392b;
}

.label-cool {
  background: rgba(52, 152, 219, 0.15);
  color: #2471a3;
}

.extra {
  list-style: none;
  padding: 0;
  margin: 10px 0 12px;
  font-size: 0.82rem;
  opacity: 0.75;
}

.extra li {
  display: inline-block;
  margin-right: 10px;
}

.detail-btn {
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: #42b883;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.detail-btn:hover {
  opacity: 0.85;
}

.empty {
  margin-top: 24px;
  padding: 16px;
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: 10px;
  opacity: 0.75;
}
</style>
