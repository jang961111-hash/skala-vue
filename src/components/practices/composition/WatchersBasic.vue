<!--
  ============================================================
  교재 130~131p | Computed & Watchers - watch()
  ============================================================
  [핵심] watch 는 반응형 값이 바뀌었을 때 **후속 로직**을 실행한다.
         (API 재조회, 데이터 저장, 로그 기록 등)

    Syntax:  watch(반응형데이터, (newVal, oldVal) => { 후속 로직 })
      · 1번째 인자: 감시할 대상 (명시해야 한다)
      · 2번째 인자: 변경 시 실행할 콜백
      · 콜백은 **새 값(newVal)과 이전 값(oldVal)**을 받는다

  ★ computed 와의 차이 ★
      computed : 값을 **만들어낸다** (반환값이 있다)
      watch    : 값이 바뀐 걸 보고 **뭔가를 한다** (반환값이 없다, 부수효과)

  [비유] computed 는 **환율 계산기**(원화를 넣으면 달러가 나옴),
         watch 는 **환율 알림**(환율이 바뀌면 문자를 보냄).

  [실무 활용] 이 실습이 시뮬레이션하는 것 — 사용자가 도시를 바꾸면
              기상청 API를 다시 호출해야 한다. 그 트리거가 watch 다.
-->
<script setup>
import { ref, watch } from 'vue'

const currentCity = ref('서울')
const logMessage = ref('아직 감시 시스템이 작동하지 않았습니다.')

// currentCity 변수를 유심히 감시하는 watch 시스템 가동
watch(currentCity, (newValue, oldValue) => {
  // 값이 바뀌는 순간, 바뀐 알맹이(값) 두 개가 자동으로 주입됩니다.
  logMessage.value = `📍 감시자 발동! [${oldValue}]에서 [${newValue}]로 변경됨.`
  // 실무 활용처 시뮬레이션
  console.log(`🤖 [서버 요청 완료] 기상청 서버에서 ${newValue}의 날씨 API를 다시 조회합니다...`)
})
</script>

<template>
  <div class="practice-section">
    <h2>감시자 watch()의 원리와 실무 활용</h2>
    <h3>🏙️ 지역 선택 제어판</h3>
    <p>현재 선택된 도시: {{ currentCity }}</p>
    <button @click="currentCity = '서울'">서울 선택</button> &nbsp;
    <button @click="currentCity = '수원'">수원 선택</button> &nbsp;
    <button @click="currentCity = '부산'">부산 선택</button>

    <div class="monitor">
      <h3>👁️‍🗨️ 파수꾼(watch) 모니터링 시스템</h3>
      <p>{{ logMessage }}</p>
      <small style="color: gray">(버튼을 누른 후 브라우저 콘솔창 F12를 확인해 보세요)</small>
    </div>

    <p class="hint">
      ※ 같은 버튼을 두 번 누르면 로그가 안 바뀐다. 값이 <b>실제로 달라져야</b> watch가 발동한다.
    </p>
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
.hint {
  margin-top: 10px;
  font-size: 0.8rem;
  opacity: 0.65;
}
</style>
