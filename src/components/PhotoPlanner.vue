<!--
  ================================================================
  PhotoPlanner.vue | 사진 찍기 좋은 시간
  ================================================================
  이 앱의 주제를 드러내는 컴포넌트다.
  날씨를 나열하는 대신 "언제 나가서 찍으면 좋은가"에 답한다.

  ▸ 계산은 여기 없다
      점수 로직은 composables/usePhotoTime.js 에 있다.
      이 파일은 받아온 결과를 화면에 배치하는 일만 한다.
      교재 Composition API 단원에서 배운 로직 재사용을 실제로 적용한 지점.

  ▸ 여기 쓰인 문법
      props (155p) · computed (120p) · v-for + :key (88p)
      v-if / v-else (84p) · :class 객체구문 (79p) · @click (100p)
  ================================================================
-->
<script setup>
import { computed, ref } from 'vue'
import { photoPlan, toLocalHM } from '../composables/usePhotoTime.js'

/* ================================================================
   [교재 158p] props 옵션 — type / required / default / validator
   ================================================================
   validator 는 부모가 넘긴 값이 이 컴포넌트가 감당할 수 있는 모양인지
   자식이 직접 검사하는 함수다. false 를 돌려주면 개발 중 콘솔에 경고가 뜬다.

   여기서는 city 에 sunrise·sunset 이 있어야만 촬영 구간을 만들 수 있다.
   없는 채로 들어오면 화면이 조용히 비어버려서 원인을 찾기 어렵다.
   그래서 "왜 안 나오는지"를 콘솔이 먼저 알려주게 했다.

   배열·객체를 default 로 줄 때는 반드시 화살표 함수로 감싸 반환한다.
   그대로 쓰면 모든 인스턴스가 같은 객체를 공유한다.
   ================================================================ */
const props = defineProps({
  city: {
    type: Object,
    required: true,
    validator: (c) => {
      const ok = Boolean(c && c.sunrise && c.sunset)
      if (!ok) console.warn('[PhotoPlanner] city 에 sunrise/sunset 이 없습니다.', c)
      return ok
    },
  },
  forecast: { type: Array, default: () => [] },
  airTable: { type: Object, default: () => ({}) },
})

// 하루에 촬영 구간이 4개씩 × 3일 = 최대 12개.
// 전부 보여주면 고르기 어려워서 기본은 상위 4개만 보여준다.
const showAll = ref(false)

const plan = computed(() => photoPlan(props.city, props.forecast, props.airTable, 3))

const ranked = computed(() => [...plan.value].sort((a, b) => b.score - a.score))

const visible = computed(() => (showAll.value ? ranked.value : ranked.value.slice(0, 4)))

const best = computed(() => ranked.value[0] ?? null)

const tz = computed(() => props.city?.timezone ?? 0)

const dayLabel = (d) => (d === 0 ? '오늘' : d === 1 ? '내일' : `${d}일 뒤`)
</script>

<template>
  <section v-if="plan.length" class="planner">
    <header class="planner-head">
      <div>
        <h2>📷 언제 찍으러 나갈까</h2>
        <p class="sub">
          해 뜨고 지는 시각 · 구름량 · 미세먼지를 함께 봐서 {{ city.name }}의 촬영 시간을 점수로
          매겼습니다.
        </p>
      </div>
      <div v-if="best" class="best">
        <span class="best-label">가장 좋은 때</span>
        <strong>{{ dayLabel(best.dayOffset) }} {{ best.icon }} {{ best.name }}</strong>
        <span class="best-time">{{ toLocalHM(best.from, tz) }} – {{ toLocalHM(best.to, tz) }}</span>
      </div>
    </header>

    <ul class="slot-list">
      <li v-for="s in visible" :key="`${s.dayOffset}-${s.key}`" class="slot">
        <div class="slot-top">
          <span class="slot-day">{{ dayLabel(s.dayOffset) }}</span>
          <span class="slot-name">{{ s.icon }} {{ s.name }}</span>
          <span class="slot-time">{{ toLocalHM(s.from, tz) }} – {{ toLocalHM(s.to, tz) }}</span>
          <span class="slot-badge" :class="s.grade.cls">{{ s.grade.label }} {{ s.score }}</span>
        </div>

        <div class="slot-bar"><span :style="{ width: s.score + '%' }"></span></div>

        <!-- 점수만 있으면 왜인지 모른다. 항목별 근거를 같이 보여준다. -->
        <div class="slot-why">
          <span v-for="b in s.breakdown" :key="b.key" :class="{ minus: b.value < 0 }">
            {{ b.label }} {{ b.value > 0 ? '+' : '' }}{{ b.value }}
          </span>
          <span class="slot-raw">
            구름 {{ s.clouds }}% · 강수 {{ s.pop }}%
            <template v-if="s.pm25 !== null">· 초미세 {{ s.pm25 }}㎍/㎥</template>
          </span>
        </div>
      </li>
    </ul>

    <button v-if="ranked.length > 4" class="more" @click="showAll = !showAll">
      {{ showAll ? '접기' : `나머지 ${ranked.length - 4}개 더 보기` }}
    </button>

    <p class="note">
      ※ 골든아워는 해 뜬 직후·해 지기 전 1시간, 블루아워는 그 앞뒤 30분입니다. 구름은 적을수록 좋은
      게 아니라 <b>20~60%</b>일 때 하늘에 그림이 생깁니다. 무료 예보가 3시간 간격이라 구간과 최대
      {{ Math.max(...visible.map((v) => v.forecastGapMin)) }}분까지 차이가 납니다.
    </p>
  </section>
</template>

<style scoped>
.planner {
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 18px 20px 16px;
  margin-bottom: 22px;
}
.planner-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.planner h2 {
  font-size: 1.05rem;
  font-weight: 700;
}
.sub {
  font-size: 0.78rem;
  opacity: 0.68;
  margin-top: 4px;
  max-width: 46ch;
}
.best {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(6, 182, 212, 0.1);
}
.best-label {
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  opacity: 0.7;
}
.best strong {
  font-size: 0.92rem;
}
.best-time {
  font-size: 0.74rem;
  opacity: 0.75;
  font-variant-numeric: tabular-nums;
}
.slot-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 9px;
}
.slot {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 10px 13px;
}
.slot-top {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.slot-day {
  font-size: 0.7rem;
  padding: 1px 7px;
  border-radius: 4px;
  background: rgba(127, 127, 127, 0.14);
}
.slot-name {
  font-weight: 600;
  font-size: 0.9rem;
}
.slot-time {
  font-size: 0.76rem;
  opacity: 0.65;
  font-variant-numeric: tabular-nums;
}
.slot-badge {
  margin-left: auto;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 999px;
}
.g1 {
  background: rgba(6, 182, 212, 0.18);
  color: #0369a1;
}
.g2 {
  background: rgba(34, 197, 94, 0.18);
  color: #15803d;
}
.g3 {
  background: rgba(234, 179, 8, 0.2);
  color: #a16207;
}
.g4 {
  background: rgba(249, 115, 22, 0.18);
  color: #c2410c;
}
.g5 {
  background: rgba(239, 68, 68, 0.18);
  color: #b91c1c;
}
.slot-bar {
  height: 4px;
  border-radius: 999px;
  background: rgba(127, 127, 127, 0.15);
  margin: 8px 0 7px;
  overflow: hidden;
}
.slot-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #06b6d4);
}
.slot-why {
  display: flex;
  flex-wrap: wrap;
  gap: 3px 12px;
  font-size: 0.71rem;
  opacity: 0.72;
  font-variant-numeric: tabular-nums;
}
.slot-why .minus {
  color: #c2410c;
}
.slot-raw {
  opacity: 0.7;
}
.more {
  margin-top: 10px;
  font-size: 0.78rem;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
}
.note {
  margin-top: 12px;
  font-size: 0.71rem;
  opacity: 0.6;
  line-height: 1.65;
}
</style>
