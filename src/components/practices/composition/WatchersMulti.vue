<!--
  ============================================================
  교재 132~133p | watch() — Multi-Source Watch
  ============================================================
  [핵심] 감시 대상을 **배열로 묶으면** 여러 개를 동시에 감시한다.

    watch([a, b], ([newA, newB], [oldA, oldB]) => { ... })

  · 1번째 인자가 배열이 되면, 콜백의 인자도 **배열로** 들어온다
  · a 든 b 든 **하나만 바뀌어도** 콜백이 한 번 실행된다

  ★ 왜 필요한가 ★
    watch 를 두 개 따로 걸면, 두 값이 같이 바뀔 때 API가 **두 번** 호출된다.
    배열로 묶으면 한 번만 호출된다. 그래서 "통합 API 요청"에 쓴다.

  [비유] 알림을 도시별·날짜별로 따로 걸어두면 둘 다 바꿀 때 문자가 두 통 온다.
         묶어서 걸면 "조건이 바뀌었습니다" 한 통만 온다.

  [실습 포인트] 도시(select)와 날짜(radio)를 바꿔가며 로그가 몇 번 찍히는지 보세요.
-->
<script setup>
import { ref, watch } from 'vue'

const city = ref('서울')
const dateType = ref('오늘')
const apiStatus = ref('대기 중...')

// 두 개의 ref 변수를 배열[] 형태로 묶어 동시에 감시합니다.
watch([city, dateType], ([newCity, newDate], [oldCity, oldDate]) => {
  apiStatus.value = `[변경 감지] ${oldCity}(${oldDate}) ➡️ ${newCity}(${newDate})`
  // 실무 활용: 두 옵션 중 하나만 바뀌어도 통합 API 요청을 보냅니다.
  console.log(`🤖 [통합 API 호출] ${newCity}의 ${newDate} 날씨를 불러옵니다...`)
})
</script>

<template>
  <div class="practice-section">
    <h2>여러 개의 변수 동시 감시 (watch)</h2>
    <h3>날씨 조건 설정</h3>

    <label>도시: </label>
    <select v-model="city">
      <option value="서울">서울</option>
      <option value="수원">수원</option>
      <option value="부산">부산</option>
    </select>

    <br />
    <label>날짜: </label>
    <label><input type="radio" value="오늘" v-model="dateType" /> 오늘</label> &nbsp;
    <label><input type="radio" value="내일" v-model="dateType" /> 내일</label> &nbsp;
    <label><input type="radio" value="주간예보" v-model="dateType" /> 주간예보</label>

    <div class="monitor">
      <h3>통합 모니터링 로그</h3>
      <p>현재 상태: {{ apiStatus }}</p>
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
