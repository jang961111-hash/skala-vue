<!--
  ============================================================
  교재 141~142p | watchEffect()
  ============================================================
  [핵심] 감시 대상을 **지정하지 않는다.** 콜백 안에서 접근한 반응형 데이터를
         Vue가 자동으로 추적한다.

    watchEffect(() => { ...여기서 읽은 반응형 값들이 자동 감시 대상... })

  ★ watch 와의 3가지 차이 ★

  ┌───────────────┬──────────────────────┬─────────────────────────┐
  │               │ watch                │ watchEffect             │
  ├───────────────┼──────────────────────┼─────────────────────────┤
  │ 감시 대상      │ 직접 명시            │ 자동 추적               │
  │ 이전 값       │ oldVal 받음          │ ❌ 없음 (현재 시점만)    │
  │ 최초 실행     │ 안 함 (바뀌어야 실행) │ ✅ **마운트 시 1회 즉시** │
  └───────────────┴──────────────────────┴─────────────────────────┘

  [비유] watch 는 **특정 사람을 지목해서 미행**하는 것.
         watchEffect 는 **CCTV를 켜두면 화면에 들어온 사람이 자동 등록**되는 것.
         그리고 CCTV는 켜는 순간 이미 화면을 한 번 찍는다(최초 1회 실행).

  [주의] 자동 추적이라 편하지만, 콜백 안에서 무심코 읽은 값까지 감시 대상이 된다.
         의도치 않은 재실행이 생기면 watch 로 대상을 좁히는 게 낫다.

  [실습 포인트] ★ 새로고침하자마자 버튼을 안 눌러도 로그가 이미 찍혀 있다 ★
                이게 watch 와 가장 눈에 띄는 차이다. 콘솔(F12)로 확인하세요.
-->
<script setup>
import { ref, watchEffect } from 'vue'

const username = ref('홍길동')
const age = ref(20)
const logMessage = ref('대기 중...')

// watchEffect 가동: 감시 대상을 지정하는 파라미터가 없습니다!
watchEffect(() => {
  // Vue가 이 내부 코드를 읽고 'username'과 'age'를 자동으로 감시 리스트에 등록합니다.
  logMessage.value = `[자동 감지] 이름: ${username.value} / 나이: ${age.value}세`
  // 화면이 처음 켜질 때 1등으로 즉시 실행되는 증거를 콘솔에서 확인합니다.
  console.log('🤖 watchEffect가 내부 변수 변경을 감지하여 실행되었습니다.')
})
</script>

<template>
  <div class="practice-section">
    <h2>자동 감시자 watchEffect()</h2>
    <p>이름: {{ username }} / 나이: {{ age }}세</p>
    <button @click="username = '이순신'">이름을 '이순신'으로 변경</button> &nbsp;
    <button @click="age++">나이 한 살 추가 (age++)</button>

    <div class="monitor">
      <h3>👁️‍🗨️ watchEffect 자동 모니터링 시스템</h3>
      <p>{{ logMessage }}</p>
      <small style="color: gray"
        >※ 새로고침하자마자 버튼을 안 눌러도 로그가 이미 찍혀있는 특징을 주목하세요!</small
      >
    </div>
  </div>
</template>

<style scoped>
.monitor {
  margin-top: 14px;
  padding: 12px 16px;
  border-left: 3px solid #42b883;
  background: rgba(66, 184, 131, 0.08);
  border-radius: 0 6px 6px 0;
}
</style>
