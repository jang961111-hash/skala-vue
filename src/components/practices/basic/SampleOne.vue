<!--
  ============================================================
  교재 70p | Dev Setup - Reactivity Example
  ============================================================
  [핵심] 반응형 변수(ref)와 일반 변수의 차이

  - 일반 변수 (let normalCount = 0)
      값은 내부적으로 분명히 바뀌지만, Vue가 감시하지 않으므로
      화면(template)은 다시 그려지지 않는다.
  - 반응형 변수 (const vueCount = ref(0))
      ref()로 감싸는 순간 Vue가 이 값을 "감시 대상"으로 등록한다.
      값이 바뀌면 이 변수를 쓴 template 부분이 자동으로 다시 그려진다.

  [비유] 일반 변수는 '혼잣말', 반응형 변수는 '마이크에 대고 말하기'.
         둘 다 말은 하지만, 청중(화면)에게 들리는 건 마이크 쪽뿐이다.

  [관찰 포인트]
    1) '일반 변수 증가'를 여러 번 눌러도 숫자가 그대로다.
    2) 그 상태에서 'Vue 변수 증가'를 한 번 누르면
       → 화면 전체가 새로 그려지면서, 그동안 몰래 올라가 있던
         normalCount 값도 그제서야 같이 반영된다. (교재 70p 3번째 불릿)

  [참고] 교재 70p: JS 끝에 ";"를 빼먹어도 ASI(Automatic Semicolon
         Insertion) 덕분에 동작한다. 이 프로젝트는 Prettier 설정을 따라
         세미콜론 없이 통일한다.
-->
<script setup>
import { ref } from 'vue'

// 1. 일반 변수 (화면이 실시간으로 바뀌지 않음)
let normalCount = 0
// 2. 반응성 변수 (화면이 실시간으로 바뀜)
const vueCount = ref(0)
</script>

<template>
  <div class="practice-section">
    <h2>Hello Skala-Vue</h2>
    <h3>일반 변수 클릭: {{ normalCount }}</h3>
    <button @click="normalCount++">일반 변수 증가</button>
    <br />
    <h3>Vue 반응성 변수 클릭: {{ vueCount }}</h3>
    <!--
      script에서는 vueCount.value 로 접근하지만,
      template 안에서는 Vue가 .value 를 자동으로 벗겨주므로 그냥 vueCount 로 쓴다.
    -->
    <button @click="vueCount++">Vue 변수 증가</button>
  </div>
</template>
