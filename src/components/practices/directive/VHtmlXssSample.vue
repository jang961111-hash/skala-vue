<!--
  ============================================================
  교재 75p | Vue Directive - v-html 과 XSS
  ============================================================
  [핵심] v-html의 대가(代價) — XSS(Cross-Site Scripting) 취약점

  v-html은 "받은 문자열을 진짜 HTML로 실행"한다.
  그 문자열이 '사용자 입력'이라면? 공격자가 심어둔 코드가
  그 글을 읽는 다른 사용자의 브라우저에서 그대로 실행된다.
  → 쿠키 / 세션 토큰 / 로그인 정보 탈취로 이어진다.

  [철칙] v-html에는 절대 '사용자가 입력한 값'을 그대로 넣지 않는다.
         꼭 필요하면 DOMPurify 같은 라이브러리로 새니타이징(정화)한 뒤 넣는다.

  [실습 - 교재 75p 하단]
    입력창에 아래를 붙여넣고 '확인'을 누르면 구글로 강제 이동된다.
      <img src="x" onerror="window.location.href='https://google.com'" />
    ※ 페이지가 날아가므로, 실습 후 브라우저 뒤로가기로 돌아오면 된다.
    ※ <script> 태그는 innerHTML로 삽입되면 실행되지 않는다.
       그래서 공격자는 이렇게 onerror 같은 '이벤트 속성'을 쓴다.
       — 이게 XSS가 막기 까다로운 이유다.
-->
<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const message = ref('')

function showMessage() {
  message.value = inputValue.value
}
</script>

<template>
  <div class="practice-section">
    <h2>v-html XSS 학습</h2>
    <!-- v-model: 입력창 ↔ inputValue 양방향 바인딩 (교재 뒤쪽에서 정식으로 다룸) -->
    <input v-model="inputValue" placeholder="내용을 입력하세요" />
    <button @click="showMessage">확인</button>
    <div v-html="message"></div>
  </div>
</template>
