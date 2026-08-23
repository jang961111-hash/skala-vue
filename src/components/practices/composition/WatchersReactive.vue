<!--
  ============================================================
  교재 137~139p | watch() — reactive 반응형 데이터 감시
  ============================================================
  [핵심] reactive 로 만든 객체는 ref 와 감시 규칙이 다르다.

  ★ ref 객체와의 차이 ★
      ref 객체    : watch(user, ...)  → ❌ 안 잡힘. { deep: true } 를 켜야 함
      reactive 객체: watch(state, ...) → 🟢 **자동으로 deep 이 켜진다**

  그런데 여기에 함정이 하나 더 있다.

  ┌──────────────────────────────────────────────────────────┐
  │ ① watch(state, (newVal, oldVal) => ...)                  │
  │    · deep 은 자동으로 켜지지만                             │
  │    · ⚠️ oldVal 과 newVal 이 **똑같이 나온다**              │
  │      (둘 다 같은 객체를 가리키므로 과거를 보존 못 함)       │
  ├──────────────────────────────────────────────────────────┤
  │ ② watch(() => state.price, (newP, oldP) => ...)          │
  │    · 특정 속성만 조준                                      │
  │    · 🟢 **진짜 과거 값이 보존된다** (원시값을 뽑았으므로)   │
  └──────────────────────────────────────────────────────────┘

  [비유] ①은 방 사진을 "지금"과 "아까" 두 장 찍었는데, 알고 보니 둘 다
         **같은 방을 실시간으로 비추는 모니터**였던 것. 두 화면이 같을 수밖에 없다.
         ②는 가격표만 따로 **복사해 둔 것** — 원본이 바뀌어도 복사본은 그대로다.

  [실습 포인트] '가격 500원 인상' 을 누르고 두 모니터를 비교하세요.
    ① 이전가격/현재가격이 **같은 숫자**로 찍힌다
    ② 옛날값/바뀐값이 **다르게** 찍힌다
-->
<script setup>
import { reactive, ref, watch } from 'vue'

// reactive로 선언한 묶음 상품 데이터
const state = reactive({
  productName: '노트북',
  price: 1000,
})
const logAutoDeep = ref('대기 중...')
const logTarget = ref('대기 중...')

// 🟢 1) 변수명 그대로 감시 (자동 deep: true 작동)
watch(state, (newVal, oldVal) => {
  // newVal.price와 oldVal.price가 똑같이 나옵니다!
  logAutoDeep.value = `[자동 deep] 가격 변동! 이전가격인척하는:${oldVal.price}원 ➡️ 현재가격:${newVal.price}원`
})

// 🟢 2) 화살표 함수로 특정 속성만 감시 (이전 값 추적 가능!)
watch(
  () => state.price,
  (newPrice, oldPrice) => {
    // 🔥 특정 알맹이 값만 추출했으므로 진짜 과거 가격이 정상 보존됩니다.
    logTarget.value = `[타겟 조준] 가격이 진짜 올랐음! 옛날값:${oldPrice}원 ➡️ 바뀐값:${newPrice}원`
  },
)
</script>

<template>
  <div class="practice-section">
    <h2>reactive() 데이터 watch 감시 규칙</h2>
    <h3>🛒 상품 정보 관리 (reactive)</h3>
    <p>상품명: {{ state.productName }} / 가격: {{ state.price }}원</p>
    <button @click="state.price += 500">가격 500원 인상</button>

    <div class="monitor auto">
      <p>👁️‍🗨️ 1) state 변수 통째로 감시 (deep 자동화)</p>
      <p>{{ logAutoDeep }}</p>
      <small>※ 주의: 이전 값과 현재 값이 똑같이 찍힌다.</small>
    </div>

    <div class="monitor target">
      <p>🎯 2) () =&gt; state.price 콕 집어 감시 (과거 추적)</p>
      <p>{{ logTarget }}</p>
      <small>※ 성공: 과거의 원본 가격이 칼같이 보존된다.</small>
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
.monitor small {
  opacity: 0.7;
}
</style>
