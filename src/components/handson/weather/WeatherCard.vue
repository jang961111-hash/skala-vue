<!--
  ================================================================
  교재 178p 요구사항 4 | WeatherCard.vue
  ================================================================
  ▸ props (부모 → 자식)
      city     : 도시 객체 하나 { id, name, temp, status, humidity, wind, feelsLike }
      selected : 이 카드가 현재 선택된 카드인지

  ▸ emits (자식 → 부모)
      select-card  : 카드 클릭 → 도시 이름을 실어 보냄
      click-detail : [상세보기] 클릭 → 도시 이름·상태를 실어 보냄

  ★★ 분리하고 나서 .stop 이 더 중요해진 이유 ★★
    버튼이 카드 안에 있으므로 .stop 이 없으면
      버튼 클릭 → click-detail emit + (버블링) 카드 클릭 → select-card emit
    두 이벤트가 **동시에** 부모로 올라간다.
    분리 전에는 같은 파일 안의 문제였지만, 이제는
    **부모가 원치 않는 이벤트를 두 개 받는** 문제가 된다. (교재 102p)

  ▸ props 로 받은 city 는 읽기 전용이다
    자식이 city.temp 를 직접 고칠 수 없다. 고쳐야 한다면 emit 으로 요청해야 한다.
    (이 컴포넌트는 표시만 하므로 그럴 일이 없다)

  ▸ 객체를 props 로 넘기는 것은 완전히 정상이다
    String/Number/Boolean 뿐 아니라 Array, Object, Function, Date 등
    거의 제약 없이 넘길 수 있다. (교재 163p)
  ================================================================
-->
<script setup>
// script 안에서 props 에 접근하려면 반환값을 변수에 담아야 한다 (교재 162p)
// template 안에서는 props. 없이 city 로 바로 쓴다
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const onSelect = () => {
  emit('select-card', props.city.name)
}

const onDetail = () => {
  emit('click-detail', props.city.name, props.city.status)
}
</script>

<template>
  <article
    class="weather-tile"
    :class="{
      'is-selected': selected,
      'is-hot': city.temp >= 25,
      'is-cool': city.temp < 25,
    }"
    @click="onSelect"
  >
    <div class="tile-head">
      <h4>{{ city.name }}</h4>
      <span class="temp-badge">{{ city.temp }}℃</span>
    </div>

    <p class="status">현재 상태 · {{ city.status }}</p>

    <!-- 요구사항 2 (116p): 25도 기준 조건부 라벨 — 분리해도 그대로 유지 -->
    <span v-if="city.temp >= 25" class="label label-hot">🔥 더움 (25도 이상)</span>
    <span v-else class="label label-cool">❄️ 선선함 (25도 미만)</span>

    <ul class="chips">
      <li>🌡️ 체감 {{ city.feelsLike }}℃</li>
      <li>💧 습도 {{ city.humidity }}%</li>
      <li>💨 풍속 {{ city.wind }}m/s</li>
    </ul>

    <!-- ★ .stop 이 없으면 부모가 click-detail 과 select-card 를 둘 다 받는다 -->
    <button type="button" class="detail-btn" @click.stop="onDetail">상세보기 →</button>
  </article>
</template>

<style scoped>
/* 요구사항 5: 카드 디자인은 이 파일이 책임진다 */
.weather-tile {
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-left-width: 4px;
  border-radius: 10px;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease;
}

.weather-tile.is-hot {
  border-left-color: #f97316;
}
.weather-tile.is-cool {
  border-left-color: #0ea5e9;
}

.weather-tile:hover {
  transform: translateY(-2px);
}

.weather-tile.is-selected {
  outline: 2px solid #6366f1;
  outline-offset: -1px;
}

.tile-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.tile-head h4 {
  font-size: 1.05rem;
  font-weight: 700;
}

.temp-badge {
  padding: 3px 11px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff;
}

.is-hot .temp-badge {
  background: #f97316;
}
.is-cool .temp-badge {
  background: #0ea5e9;
}

.status {
  font-size: 0.85rem;
  opacity: 0.75;
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
  background: rgba(249, 115, 22, 0.16);
  color: #c2410c;
}
.label-cool {
  background: rgba(14, 165, 233, 0.16);
  color: #0369a1;
}

.chips {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chips li {
  font-size: 0.76rem;
  padding: 3px 9px;
  border-radius: 6px;
  background: rgba(127, 127, 127, 0.12);
}

.detail-btn {
  padding: 5px 13px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #6366f1;
  background: transparent;
  border: 1px solid #6366f1;
  border-radius: 999px;
  cursor: pointer;
}

.detail-btn:hover {
  background: #6366f1;
  color: #fff;
}
</style>
