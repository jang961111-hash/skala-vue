<!--
  ============================================================
  교재 127~128p | Computed & Watchers - computed()
  ============================================================
  [핵심] computed 는 **의존하는 값이 바뀔 때만** 재계산하고, 결과를 캐싱한다.

    Syntax:  const 식별자 = computed(() => { return 값 })
    · 인자로 콜백 함수를 넣는다
    · 반환값은 Computed Ref 객체 → script 에서는 .value 로 읽는다
    · **읽기 전용**이다. 다른 값으로 재할당할 수 없다

  ★★ 이 실습의 존재 이유 — 일반 함수와의 차이를 눈으로 본다 ★★

  Vue의 재렌더링 원리 (교재 128p):
    1. 반응형 값이 바뀌면 Vue는 그 컴포넌트를 다시 그려야 한다고 판단한다
    2. 다시 그릴 때 <template> 안의 **모든 표현식과 메서드 호출을 처음부터 끝까지 재평가**한다
    3. 그래서 {{ getMethodResult() }} 처럼 괄호를 붙여 호출한 일반 함수는
       조건 불문 **무조건 다시 실행**된다

  [실습 순서 — 콘솔(F12)을 열고 하세요]
    · 'count 증가' 클릭 → 일반 함수 로그 ❌ + computed 로그 ✅ **둘 다** 출력
    · 'dummy 증가' 클릭 → 일반 함수 로그 ❌만 출력
      (computed 는 count 가 안 바뀌었으므로 재연산하지 않고 캐싱값 재사용)

  [비유] 일반 함수는 **매번 계산기를 두드리는 것**,
         computed 는 **답을 포스트잇에 적어두고 재료가 바뀔 때만 다시 계산하는 것**.
-->
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const dummy = ref(0) // computed와 무관한 변수

// 1. 일반 함수: 화면이 조금이라도 리렌더링되면 무조건 재실행
const getMethodResult = () => {
  console.log('❌ 일반 함수 실행됨!')
  return count.value * 2
}

// 2. Computed: count가 바뀔 때만 재연산 (dummy가 바뀔 땐 이전 값 재사용)
const doubleCount = computed(() => {
  console.log('✅ Computed 연산 실행됨!')
  return count.value * 2
})
</script>

<template>
  <div class="practice-section">
    <h2>computed() 캐싱 동작 비교</h2>
    <p>count: {{ count }} | dummy: {{ dummy }}</p>
    <button @click="count++">count 증가 (의존성 변경)</button>
    <button @click="dummy++">dummy 증가 (무관한 변경)</button>

    <!-- dummy 버튼을 누를 때 콘솔 출력 차이를 확인 -->
    <p>일반 함수 결과: {{ getMethodResult() }}</p>
    <p>Computed 결과: {{ doubleCount }}</p>

    <p class="hint">※ F12 콘솔을 열고 두 버튼을 번갈아 눌러 로그 개수를 비교하세요.</p>
  </div>
</template>

<style scoped>
.hint {
  margin-top: 10px;
  font-size: 0.8rem;
  opacity: 0.65;
}
</style>
