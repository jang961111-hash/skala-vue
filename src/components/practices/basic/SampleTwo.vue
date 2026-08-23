<!--
  ============================================================
  교재 71p | Dev Setup - Text Interpolation Example
  ============================================================
  [핵심] {{ }} 안에는 '변수'만이 아니라 'JavaScript 표현식(Expression)'이 들어간다.

  - 표현식(Expression)  = 값으로 "평가되는" 코드      → {{ }} 안에 가능
  - 문장(Statement)     = 실행되는 코드(if, for 등)   → {{ }} 안에 불가능

  [비유] {{ }}는 계산기 화면이다. "1+1" 처럼 답이 나오는 건 넣을 수 있지만,
         "만약 ~라면" 같은 문장은 계산기에 넣을 수 없다.

  [주의] 교재 코드에는 `import { ref } from 'vue'` 가 있지만
         실제로 ref를 쓰지 않는다. 그대로 두면 ESLint가
         "선언했는데 안 쓴 변수" 경고(no-unused-vars)를 낸다.
         → 강사님이 Day2 오전에 언급하신 바로 그 밑줄 현상.
         여기서는 lint를 통과시키기 위해 의도적으로 제거했다.
-->
<script setup>
const welcomeMessage = 'Welcome to Skala-Vue'
</script>

<template>
  <div class="practice-section">
    <!-- 1) 변수 그대로 출력 -->
    <h2>{{ welcomeMessage }}</h2>
    <!-- 2) 변수가 가진 메서드 호출 (문자열 → 대문자) -->
    <p>{{ welcomeMessage.toUpperCase() }}</p>
    <!-- 3) 문자열 연결 + 내장 객체(Math) 사용까지 전부 가능 -->
    <p>{{ 'Random number: ' + Math.ceil(Math.random() * 100) }}</p>
  </div>
</template>
