<!--
  ============================================================
  교재 83p | Vue Directive - v-bind : same-name shorthand
  ============================================================
  [핵심] Vue 3.4+ 문법. 변수명과 HTML 속성명이 '완전히 같을 때'
         뒤의 ="..." 부분까지 통째로 생략할 수 있다.

      <img v-bind:src="src" />   ← 원형
      <img :src="src" />         ← 콜론 축약
      <img :src />               ← same-name 축약  ★ 여기

  [동작 원리] Vue 엔진: "src 속성에, 이름이 똑같은 src 변수를 매핑하라는 뜻이구나"

  [실무 팁] 변수명을 id, src, href, disabled 같은 HTML 표준 속성명과
            똑같이 맞춰 선언해두면 코드가 확 짧아진다.

  [주의] 이건 '이름이 같을 때만' 쓰는 문법이다.
         :href="dynamicUrl" 처럼 이름이 다르면 절대 생략할 수 없다.
-->
<script setup>
const id = 'user-profile-card'
const src = 'https://vuejs.org/images/logo.png'
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급 (단축 문법)</h2>
    <!-- :id 만 적었는데 id 변수가 자동 연결된다. 개발자도구로 id 속성을 확인해 볼 것 -->
    <div :id>
      <img :src alt="Vue 로고" style="width: 50px" />
    </div>
  </div>
</template>
