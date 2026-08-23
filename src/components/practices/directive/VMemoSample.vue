<!--
  ============================================================
  교재 92p | Vue Directive - v-memo
  ============================================================
  [핵심] "지정한 변수가 바뀔 때만 이 구역을 다시 그려라.
          아니면 이전에 그려둔 화면(캐시)을 그대로 재사용해라."

      v-memo="[감시할변수1, 감시할변수2]"

  [v-once 와의 관계]
    v-once  = 아예 한 번만 그림 (무조건)
    v-memo  = 조건부로 그림 (지정한 변수가 바뀔 때만)
    → v-memo="[]" 는 v-once 와 사실상 같다.

  [실습 순서 — 이렇게 눌러봐야 이해된다]
    1. '2. 나이 한 살 추가'를 여러 번 누른다 → 화면의 나이가 안 바뀐다!
       (감시 대상이 name 뿐이라 age가 바뀌어도 갱신 안 함)
    2. 그 상태에서 '1. 이름 변경'을 한 번 누른다
       → 이름이 바뀌면서, 그동안 몰래 올라가 있던 나이도 한꺼번에 반영된다.
    ※ SampleOne.vue의 '일반 변수 / 반응형 변수' 실습과 똑같은 구조다.

  [중요도] 낮음. 대용량 리스트 최적화용 고급 기능이다. (강사님)
-->
<script setup>
import { ref } from 'vue'

const name = ref('홍길동')
const age = ref(20)
</script>

<template>
  <div class="practice-section">
    <h2>v-memo 디렉티브 학습</h2>
    <div v-memo="[name]" style="padding: 20px; border: 1px solid #42b883; margin-bottom: 10px">
      <p>📦 v-memo 적용 영역 (기준: name)</p>
      <p>이름: {{ name }}</p>
      <p>나이: {{ age }} (name이 바뀌어야 얘도 갱신됨)</p>
    </div>
    <button @click="name = '이순신'">1. 이름 변경 (이순신)</button> &nbsp;
    <button @click="age++">2. 나이 한 살 추가 (age++)</button>
  </div>
</template>
