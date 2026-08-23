<!--
  ============================================================
  교재 134~136p | watch() — Deep Watch (ref 객체 감시)
  ============================================================
  ★★ 가장 많이 범하는 오류 ★★

      const user = ref({ name: '홍길동', age: 20 })
      watch(user, () => { ... })      // ❌ 이 로그는 영원히 안 찍힌다

  왜? watch 는 기본적으로 **참조(reference)가 바뀌었는지**만 본다.
  `user.value.age++` 는 객체 **내부**만 바꾼 것이라, 상자 자체는 그대로다.
  → 상자가 안 바뀌었으니 watch 는 "변화 없음"으로 판단한다.

  ────────────────────────────────────────────────────────────
  해결책 2가지 — 이 실습이 나란히 보여주는 것
  ────────────────────────────────────────────────────────────

  ① { deep: true } — 상자 속까지 뒤져서 감시
       watch(user, (newVal) => {...}, { deep: true })
       · 하위 속성 **전부** 감시된다 (이름을 바꿔도, 나이를 바꿔도 발동)
       · ⚠️ 대신 이전 값(oldVal)이 새 값과 **똑같이** 나온다
         (같은 객체를 가리키고 있어서 과거를 보존하지 못함)

  ② () => user.value.age — 화살표 함수로 속성 하나만 조준
       watch(() => user.value.age, (newAge, oldAge) => {...})
       · 나이가 바뀔 때만 발동 (이름 변경엔 반응 안 함)
       · 🟢 **이전 값이 정상 보존된다** (원시값을 뽑아냈으므로)

  [비유] ①은 방 전체에 감시 카메라를 켜는 것 — 뭐가 바뀌든 알지만
         "무엇이 어떻게 있었는지" 기록은 남지 않는다.
         ②는 시계 하나만 지켜보는 것 — 시계만 알지만 몇 시에서 몇 시로
         바뀌었는지 정확히 안다.

  [실습 순서]
    1. '이름만 변경' → ① deep 모니터만 반응, ② 타겟 모니터는 무반응
    2. '나이만 변경' → ①② 둘 다 반응. ②만 "20세 ➡️ 21세" 처럼 과거를 보여줌
-->
<script setup>
import { ref, watch } from 'vue'

const user = ref({
  name: '홍길동',
  age: 20,
})
const logDeep = ref('아직 반응 없음')
const logTarget = ref('아직 반응 없음')

// 실패하는 예시 (가장 많이 범하는 오류)
// watch(user, () => { console.log('이 로그는 영원히 안 찍힙니다.') })

// 해결책 1: deep 옵션을 켜서 객체 하위 속성 전체 감시하기
watch(
  user,
  (newVal) => {
    logDeep.value = `[deep 감지] 누군가 변경됨! 현재 이름: ${newVal.name}, 나이: ${newVal.age}`
  },
  { deep: true },
)

// 해결책 2: 화살표 함수로 특정 속성(age)만 콕 집어 감시하기 (★이전 값 추적 가능!)
watch(
  () => user.value.age,
  (newAge, oldAge) => {
    logTarget.value = `[타겟 감지] 나이가 ${oldAge}세 ➡️ ${newAge}세로 변경됨!`
  },
)
</script>

<template>
  <div class="practice-section">
    <h2>ref 객체/배열 감시</h2>
    <h3>👨‍💻 회원 데이터 조작 panel</h3>
    <p>이름: {{ user.name }} / 나이: {{ user.age }}세</p>
    <button @click="user.name = '이순신'">이름만 변경</button> &nbsp;
    <button @click="user.age++">나이만 변경 (age++)</button>

    <div class="monitor">
      <p>👁️‍🗨️ 1) deep: true 모니터 (전체 감시)</p>
      <p>{{ logDeep }}</p>
    </div>

    <div class="monitor target">
      <p>🎯 2) 화살표 함수 모니터 (나이만 타겟 감시)</p>
      <p>{{ logTarget }}</p>
    </div>
  </div>
</template>

<style scoped>
.monitor {
  margin-top: 12px;
  padding: 12px 16px;
  border-left: 3px solid #42b883;
  background: rgba(66, 184, 131, 0.08);
  border-radius: 0 6px 6px 0;
}
.monitor.target {
  border-left-color: #f39c12;
  background: rgba(243, 156, 18, 0.1);
}
</style>
