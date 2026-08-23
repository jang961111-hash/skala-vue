<!--
  ================================================================
  LightTimeline.vue | 하루의 빛 타임라인
  ================================================================
  이 앱을 기억하게 만드는 요소로 잡았다.

  ▸ 왜 이 모양인가
      "언제 나가면 좋은가"가 이 앱의 질문이다.
      숫자로 18:13 이라고 쓰는 것보다, 하루라는 가로 축 위에서
      그 시각이 어디쯤인지 보이는 편이 빠르다.

      막대를 칠하는 색도 임의로 고르지 않았다.
      실제로 그 시간에 하늘이 띠는 색을 토큰으로 만들어 두고 그대로 쓴다.
        블루아워 → --dawn   골든아워 → --golden   한낮 → 옅은 중성

  ▸ 지금 시각 마커
      현재 위치를 세로선으로 표시한다. 1분마다 스스로 갱신되고,
      화면에서 사라질 때 타이머를 정리한다.
      지나간 구간은 살짝 흐리게 둔다.
      단, 촬영 구간(골든·블루)은 덜 흐리게 한다.
      이 막대의 목적은 "오늘 남은 시간"이 아니라
      "하루의 빛이 어떻게 흐르는가"이기 때문이다.

  ▸ 여기 쓰인 문법
      props (155p) · computed (120p) · v-for + :key (88p)
      :style 바인딩 (81p) · :class 객체구문 (79p)
  ================================================================
-->
<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  /** 도시 하나. sunrise / sunset / timezone 이 필요하다. */
  city: { type: Object, required: true },
})

const DAY = 86400
const HOUR = 3600

/** UTC 초 → 그 도시 기준 '하루 중 몇 %' */
const pct = (utcSec) => {
  const local = (utcSec + (props.city.timezone ?? 0)) % DAY
  return (((local + DAY) % DAY) / DAY) * 100
}

const toHM = (utcSec) =>
  new Date((utcSec + (props.city.timezone ?? 0)) * 1000).toISOString().slice(11, 16)

/**
 * 하루를 구간으로 나눈다.
 * 겹치는 구간이 없도록 순서대로 이어 붙인다.
 */
const bands = computed(() => {
  const { sunrise, sunset } = props.city
  if (!sunrise || !sunset) return []
  return [
    { key: 'night-am', label: '밤', from: 0, to: pct(sunrise - 30 * 60), tone: 'night' },
    {
      key: 'blue-am',
      label: '블루아워',
      from: pct(sunrise - 30 * 60),
      to: pct(sunrise),
      tone: 'blue',
    },
    {
      key: 'gold-am',
      label: '골든아워',
      from: pct(sunrise),
      to: pct(sunrise + HOUR),
      tone: 'gold',
    },
    { key: 'day', label: '한낮', from: pct(sunrise + HOUR), to: pct(sunset - HOUR), tone: 'day' },
    { key: 'gold-pm', label: '골든아워', from: pct(sunset - HOUR), to: pct(sunset), tone: 'gold' },
    {
      key: 'blue-pm',
      label: '블루아워',
      from: pct(sunset),
      to: pct(sunset + 30 * 60),
      tone: 'blue',
    },
    { key: 'night-pm', label: '밤', from: pct(sunset + 30 * 60), to: 100, tone: 'night' },
  ].filter((b) => b.to > b.from)
})

/* ================================================================
   현재 시각 마커를 살아 있게 한다 (교재 153p 라이프사이클)
   ================================================================
   처음에는 Date.now() 를 computed 안에서 바로 읽었다. 그런데
   Date.now() 는 반응형이 아니라서 다른 값이 바뀌기 전까지 마커가
   그 자리에 멈춰 있었다. 화면을 열어두면 시간이 흘러도 안 움직인다.

   그래서 시각을 ref 에 담고 타이머로 갱신한다.
     onMounted   1분마다 갱신하는 타이머 등록
     onUnmounted **반드시** 정리

   교수님: "안 하면 브라우저 메모리를 계속 사용한다."
   이 컴포넌트는 홈에서 6개가 동시에 뜨고 라우팅으로 자주 사라진다.
   정리하지 않으면 페이지를 오갈 때마다 타이머가 쌓인다.

   1분 간격으로 잡은 이유: 이 막대는 하루(1440분)를 나타내므로
   1분은 가로로 0.07% 다. 더 자주 갱신해도 눈에 보이지 않는다.
   ================================================================ */
const nowUtc = ref(Math.floor(Date.now() / 1000))
let timerId = null

onMounted(() => {
  timerId = setInterval(() => {
    nowUtc.value = Math.floor(Date.now() / 1000)
  }, 60_000)
})

onUnmounted(() => {
  clearInterval(timerId)
  timerId = null
})

/** 지금이 하루의 몇 % 지점인가 */
const nowPct = computed(() => pct(nowUtc.value))

/** 눈금 — 6시간마다. 촘촘하면 오히려 안 읽힌다. */
const ticks = [0, 25, 50, 75, 100]

/**
 * 범례는 종류당 하나만 보여준다.
 * 아침·저녁 골든아워는 정의상 길이가 같아서 둘 다 적으면 같은 줄이 두 번 나온다.
 * 처음에 그대로 뒀더니 카드 하나가 4줄을 먹어서 목록이 안 읽혔다.
 */
const shootBands = computed(() => {
  const seen = new Set()
  return bands.value
    .filter((b) => b.tone === 'gold' || b.tone === 'blue')
    .filter((b) => {
      if (seen.has(b.tone)) return false
      seen.add(b.tone)
      return true
    })
})
</script>

<template>
  <figure v-if="bands.length" class="lt">
    <figcaption class="lt-cap">
      <span class="lt-city">{{ city.name }}</span>
      <span class="lt-sun">
        <span class="num">{{ toHM(city.sunrise) }}</span> 일출 ·
        <span class="num">{{ toHM(city.sunset) }}</span> 일몰
      </span>
    </figcaption>

    <div class="lt-track" role="img" :aria-label="`${city.name}의 하루 빛 구간`">
      <span
        v-for="b in bands"
        :key="b.key"
        class="lt-band"
        :class="[`t-${b.tone}`, { past: b.to < nowPct }]"
        :style="{ left: b.from + '%', width: b.to - b.from + '%' }"
      ></span>

      <!-- 지금 시각 -->
      <span class="lt-now" :style="{ left: nowPct + '%' }">
        <span class="lt-now-dot"></span>
      </span>
    </div>

    <div class="lt-ticks">
      <span v-for="t in ticks" :key="t" class="num" :style="{ left: t + '%' }">
        {{ String(Math.round((t / 100) * 24)).padStart(2, '0') }}
      </span>
    </div>

    <ul class="lt-legend">
      <li v-for="b in shootBands" :key="b.key">
        <i :class="`t-${b.tone}`"></i>
        {{ b.label }}
        <span class="num">아침·저녁 각 {{ Math.round(((b.to - b.from) / 100) * 24 * 60) }}분</span>
      </li>
    </ul>
  </figure>
</template>

<style scoped>
.lt {
  margin: 0;
}
.lt-cap {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-2);
  flex-wrap: wrap;
  margin-bottom: var(--gap-1);
}
.lt-city {
  font-weight: 650;
  font-size: var(--step-1);
  color: var(--color-heading);
}
.lt-sun {
  font-size: 0.76rem;
  color: var(--ink-mute);
}

.lt-track {
  position: relative;
  height: 26px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--paper-mute);
}
.lt-band {
  position: absolute;
  top: 0;
  bottom: 0;
}
/* 실제 그 시간의 하늘색을 그대로 쓴다 */
.t-night {
  background: var(--dawn);
  opacity: 0.85;
}
.t-blue {
  background: linear-gradient(180deg, var(--dawn-soft), var(--dusk));
}
.t-gold {
  background: linear-gradient(180deg, var(--golden-soft), var(--golden));
}
.t-day {
  background: var(--paper-mute);
}
/* 지나간 구간은 조금 흐리게.
   처음에 0.28 로 했더니 밤에 열면 7개 중 6개가 흐려져서
   골든아워가 어디인지 안 보였다. 이 막대의 목적은 '오늘 남은 시간'이
   아니라 '하루의 빛이 어떻게 흐르는가'라서, 구분은 하되 정보는
   남기는 선(0.5)으로 낮췄다. 촬영 구간은 더 살려 둔다. */
.lt-band.past {
  opacity: 0.5;
}
.lt-band.past.t-gold,
.lt-band.past.t-blue {
  opacity: 0.68;
}

.lt-now {
  position: absolute;
  top: -3px;
  bottom: -3px;
  width: 2px;
  background: var(--ink);
  transform: translateX(-1px);
}
.lt-now-dot {
  position: absolute;
  top: -3px;
  left: -3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ink);
}

.lt-ticks {
  position: relative;
  height: 15px;
  margin-top: 3px;
}
.lt-ticks span {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.63rem;
  color: var(--ink-mute);
}
.lt-ticks span:first-child {
  transform: none;
}
.lt-ticks span:last-child {
  transform: translateX(-100%);
}

.lt-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-1) var(--gap-3);
  list-style: none;
  padding: 0;
  margin: var(--gap-1) 0 0;
  font-size: 0.73rem;
  color: var(--ink-mute);
}
.lt-legend li {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.lt-legend i {
  width: 11px;
  height: 11px;
  border-radius: 3px;
  display: inline-block;
}
</style>
