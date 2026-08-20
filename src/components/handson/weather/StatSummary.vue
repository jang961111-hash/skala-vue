<!--
  ================================================================
  교재 178p 요구사항 7 | StatSummary.vue  (본인 추가 컴포넌트)
  ================================================================
  ▸ 요구사항 7: "본인의 Mockup 부분에서 추가로 Component 하거나
                 위의 Component 를 더 분리하여 추가 Component 를 만든다"

  ▸ 왜 이걸 분리했나
    요약 통계(도시 수 / 평균 기온)는 계산도, 상태도 갖지 않는다.
    **받은 숫자를 보여주기만 한다.**
    이런 컴포넌트를 Presentational Component(표시 전용)라 부른다.
      · props 만 있고 emits 가 없다
      · 내부 상태가 없다
      · 그래서 어디서든 재사용 가능하고 테스트하기 쉽다

  ▸ 계산은 누가 하나
    averageTemp 는 부모(WeatherParent)의 computed 다.
    이 컴포넌트는 결과만 받는다. **계산 책임과 표시 책임을 분리**한 것.
  ================================================================
-->
<script setup>
defineProps({
  count: {
    type: Number,
    required: true,
  },
  averageTemp: {
    // 부모의 computed 가 toFixed(1) 로 문자열을 돌려주므로 두 타입을 모두 허용한다
    type: [Number, String],
    required: true,
  },
})
</script>

<template>
  <div class="stat-grid">
    <div class="stat">
      <span class="stat-label">표시 중인 도시</span>
      <span class="stat-value">{{ count }}<em>곳</em></span>
    </div>
    <div class="stat">
      <span class="stat-label">평균 기온</span>
      <span class="stat-value accent">{{ averageTemp }}<em>℃</em></span>
    </div>
  </div>
</template>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.stat-label {
  font-size: 0.76rem;
  opacity: 0.7;
}

.stat-value {
  font-size: 1.45rem;
  font-weight: 700;
}

.stat-value.accent {
  color: #06b6d4;
}

.stat-value em {
  font-style: normal;
  font-size: 0.66em;
  font-weight: 500;
  opacity: 0.7;
  margin-left: 2px;
}
</style>
