<!--
  ============================================================
  교재 74p | Vue Directive - v-html
  ============================================================
  [핵심] 문자열 안의 HTML 태그를 "글자"로 볼지 "태그"로 볼지의 차이

  - {{ rawHtmlData }}        → <span> 이 글자 그대로 보인다 (이스케이프)
  - <p v-html="rawHtmlData"> → <span>이 진짜 태그로 해석되어 빨간 글씨가 된다

  - 내부적으로 JS의 element.innerHTML 과 완전히 동일하게 동작한다.

  [비유] {{ }}는 "따옴표 붙여서 그대로 읽어주기",
         v-html은 "적힌 대로 실제로 실행해주기".
         편지에 "굵게 써라"라고 적혀 있을 때,
         전자는 그 문장을 읽어주고 후자는 진짜 굵게 써버린다.
-->
<script setup>
const rawHtmlData =
  '이 글자는 <span style="color: red; font-weight: bold;">빨간색 굵은 글자</span>이다.'
</script>

<template>
  <div class="practice-section">
    <h2>v-html 디렉티브 학습</h2>
    <h3 v-pre>일반 보간법 {{}} 사용 결과:</h3>
    <p>{{ rawHtmlData }}</p>
    <br />
    <h3>v-html 디렉티브 사용 결과:</h3>
    <!-- v-html은 태그의 '내용'을 통째로 갈아끼우므로, 안쪽을 비워둔다 -->
    <p v-html="rawHtmlData"></p>
  </div>
</template>
