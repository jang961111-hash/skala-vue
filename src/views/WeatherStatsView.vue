<!--
  ================================================================
  교재 196p 요구사항 6 | WeatherStatsView.vue  ("/stats")  — 본인 추가 View
  ================================================================
  ▸ 요구사항 6: "상기 정의된 view 이외에 본인의 추가 view 를 작성하고 Routing 한다"

  ▸ 무엇을 보여주나
      기온 랭킹 / 최고·최저 / 강수 도시 수 등 목록 화면에는 없는 집계 정보

  ▸ 왜 이 화면을 골랐나 — 교재 189p Query String Routing 을 쓰기 위해서다
      /stats?sort=temp   기온 높은 순
      /stats?sort=humid  습도 높은 순

      정렬 상태가 **주소창에 남으므로** 그 URL 을 그대로 공유할 수 있고,
      새로고침해도 정렬이 유지된다.

  ▸ 동적 세그먼트(:cityId) 와 쿼리스트링(?sort=) 의 차이
      동적 세그먼트 : 그 리소스가 **무엇인지**를 결정한다 (/weather/city_01)
                      → 라우터에 패턴을 선언해야 한다
      쿼리스트링    : 같은 리소스를 **어떻게 볼지**를 결정한다 (?sort=temp)
                      → 라우터에 아무 선언도 필요 없다. 자유롭게 확장된다
  ================================================================
-->
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '../stores/weatherStore.js'

/* 원래 이 화면만 weatherStore.cities 를 직접 import 해서 쓰고 있었다.
   다른 화면은 스토어의 실시간 데이터를 보는데 통계만 고정값이라
   기온이 안 맞았다. 스토어를 보도록 바꿨다.
   스토어는 초기값이 Mock 이라 키가 없어도 그대로 동작한다. */
const weatherStore = useWeatherStore()

const route = useRoute()
const router = useRouter()

const sortKey = ref('temp')

/* 라디오도 "선택 가능한 게 하나"라 string 이다 (교재 110p).
   v-model 을 같은 변수에 걸고 :value 로 각 항목의 값을 준다. */
const DIRECTIONS = [
  { value: 'desc', label: '높은 순' },
  { value: 'asc', label: '낮은 순' },
]
const sortDir = ref('desc')

// 교재 189p — 마운트 시 주소창의 ?sort= 값으로 상태 복원
onMounted(() => {
  // 이 화면으로 바로 들어왔다면 아직 Mock 이다. 상세 화면과 같은 방식으로 처리한다.
  if (!weatherStore.lastUpdated) weatherStore.loadAllWeather()

  if (route.query.dir) sortDir.value = route.query.dir
  if (route.query.sort) {
    sortKey.value = route.query.sort
    console.log(`[useRoute] 쿼리스트링에서 정렬 기준 복원: "${route.query.sort}"`)
  }
})

const changeSort = (key) => {
  sortKey.value = key
  // 정렬 상태를 주소창에 반영 (191p router.replace — 뒤로가기 기록을 쌓지 않는다)
  router.replace({ query: { sort: key, dir: sortDir.value } })
}

const sortedList = computed(() => {
  const copy = [...weatherStore.cities]
  const pick = (c) =>
    sortKey.value === 'humid' ? c.humidity : sortKey.value === 'wind' ? c.wind : c.temp
  // 방향만 부호로 뒤집는다. 정렬 함수를 세 벌 쓰지 않아도 된다.
  const sign = sortDir.value === 'asc' ? -1 : 1
  return copy.sort((a, b) => (pick(b) - pick(a)) * sign)
})

const hottest = computed(() => [...weatherStore.cities].sort((a, b) => b.temp - a.temp)[0])
const coldest = computed(() => [...weatherStore.cities].sort((a, b) => a.temp - b.temp)[0])
const rainyCount = computed(() => weatherStore.cities.filter((c) => c.status === '비').length)
const avgTemp = computed(() =>
  (weatherStore.cities.reduce((s, c) => s + c.temp, 0) / weatherStore.cities.length).toFixed(1),
)

const unitOf = (key) => (key === 'humid' ? '%' : key === 'wind' ? 'm/s' : '℃')
const valueOf = (city) =>
  sortKey.value === 'humid' ? city.humidity : sortKey.value === 'wind' ? city.wind : city.temp

const goDetail = (id) => router.push(`/weather/${id}`)
</script>

<template>
  <main class="stats">
    <header class="page-head">
      <h2>📊 관측 통계</h2>
      <p class="sub">본인 추가 View — 교재 189p Query String Routing 활용</p>
    </header>

    <section class="highlight">
      <div class="hl">
        <span>최고 기온</span><strong>{{ hottest.name }} {{ hottest.temp }}℃</strong>
      </div>
      <div class="hl">
        <span>최저 기온</span><strong>{{ coldest.name }} {{ coldest.temp }}℃</strong>
      </div>
      <div class="hl">
        <span>평균 기온</span><strong>{{ avgTemp }}℃</strong>
      </div>
      <div class="hl">
        <span>강수 도시</span><strong>{{ rainyCount }}곳</strong>
      </div>
    </section>

    <!-- ================================================================
         [교재 110p] 입력 요소별 반응형 변수 타입
         ================================================================
         select(단일) 과 라디오는 **선택 가능한 게 하나**라 string 을 쓴다.
           sortKey  = ref('temp')   select 단일
           sortDir  = ref('desc')   라디오
         여러 개를 담아야 하는 체크박스 다중 선택은 array 를 쓴다 (홈 화면).

         원래 버튼 3개였는데 select 로 바꿨다. 항목이 늘어나도 가로로
         번지지 않고, 무엇이 선택돼 있는지 접힌 상태에서도 보인다.
         ================================================================ -->
    <div class="sort-bar">
      <label class="ctrl">
        <span>정렬 기준</span>
        <select v-model="sortKey" @change="changeSort(sortKey)">
          <option value="temp">기온</option>
          <option value="humid">습도</option>
          <option value="wind">풍속</option>
        </select>
      </label>

      <fieldset class="ctrl radio-set">
        <legend>순서</legend>
        <label v-for="d in DIRECTIONS" :key="d.value">
          <input v-model="sortDir" type="radio" name="dir" :value="d.value" />
          {{ d.label }}
        </label>
      </fieldset>

      <code>?sort={{ sortKey }}&dir={{ sortDir }}</code>
    </div>

    <ol class="rank">
      <li v-for="(city, i) in sortedList" :key="city.id" @click="goDetail(city.id)">
        <span class="no">{{ i + 1 }}</span>
        <span class="name">{{ city.name }}</span>
        <span class="bar">
          <span
            class="fill"
            :style="{ width: (valueOf(city) / valueOf(sortedList[0])) * 100 + '%' }"
          ></span>
        </span>
        <strong class="val">{{ valueOf(city) }}{{ unitOf(sortKey) }}</strong>
      </li>
    </ol>

    <p class="note">
      정렬을 바꾸면 주소창이 바뀝니다. 그 URL 을 복사해서 새 탭에 붙여넣어도 같은 정렬 상태로
      열립니다. 항목을 클릭하면 상세 페이지로 이동합니다.
    </p>
  </main>
</template>

<style scoped>
.ctrl {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-1);
  font-size: 0.82rem;
}
.ctrl select {
  padding: 5px 9px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: inherit;
  font: inherit;
  font-size: 0.82rem;
}
.radio-set {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 2px 10px 4px;
  margin: 0;
}
.radio-set legend {
  font-size: 0.68rem;
  opacity: 0.65;
  padding: 0 4px;
}
.radio-set label {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-right: 8px;
  cursor: pointer;
}

.stats {
  max-width: 820px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  line-height: 1.6;
}
.page-head h2 {
  font-size: 1.55rem;
  font-weight: 700;
}
.page-head .sub {
  font-size: 0.85rem;
  opacity: 0.65;
  margin-top: 4px;
}
.highlight {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}
.hl {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 15px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}
.hl span {
  font-size: 0.74rem;
  opacity: 0.65;
}
.hl strong {
  font-size: 1.05rem;
}
.sort-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 0.85rem;
}
.sort-bar button {
  padding: 5px 14px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0.85rem;
}
.sort-bar button.on {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.14);
  color: #6366f1;
  font-weight: 600;
}
.rank {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.rank li {
  display: grid;
  grid-template-columns: 28px 60px 1fr 80px;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
}
.rank li:hover {
  border-color: #6366f1;
}
.no {
  font-size: 0.78rem;
  opacity: 0.55;
  text-align: center;
}
.name {
  font-weight: 600;
}
.bar {
  display: block;
  height: 8px;
  border-radius: 999px;
  background: rgba(127, 127, 127, 0.16);
  overflow: hidden;
}
.fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #6366f1, #06b6d4);
}
.val {
  text-align: right;
  font-size: 0.95rem;
}
.note,
code {
  font-size: 0.8rem;
  opacity: 0.72;
}
code {
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(127, 127, 127, 0.15);
}
</style>
