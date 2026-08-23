<!--
  ============================================================
  교재 76p | Vue Directive - v-text
  ============================================================
  [핵심] v-text = 내용을 '순수 텍스트'로 채워 넣기 (JS의 innerText와 동일)

  결론부터: 실무에서 v-text는 거의 쓰지 않는다.
  {{ }} (Text Interpolation)가 완전히 같은 일을 더 짧게 하기 때문이다.

  [세 가지 비교 — 이 컴포넌트의 존재 이유]
    1) {{ content }}        → <strong> 이 글자 그대로 보임
    2) v-text="'출력: ' + content" → 위와 똑같음 (표현식도 쓸 수 있다는 것만 확인)
    3) v-html="content"     → <strong>이 태그로 해석되어 굵게 보임  ← 여기만 다름

  [정리] 태그로 해석하고 싶으면 v-html, 아니면 그냥 {{ }}.
         v-text가 낄 자리는 사실상 없다.
-->
<script setup>
const content = '안녕하세요! <strong>Skala-Vue</strong> 강의입니다.'
</script>

<template>
  <div class="practice-section">
    <h2>v-text 디렉티브 학습</h2>
    <h3 v-pre>1) 일반 보간법 {{}} 결과:</h3>
    <p>출력: {{ content }}</p>
    <br />

    <h3>2) v-text 디렉티브 결과:</h3>
    <!-- 따옴표 안은 문자열이 아니라 JS 표현식 공간이므로 문자열 연결이 가능하다 -->
    <p v-text="'출력: ' + content"></p>
    <br />

    <h3>3) v-html 결과 비교:</h3>
    <p v-html="content"></p>
  </div>
</template>
