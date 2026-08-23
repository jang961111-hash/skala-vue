<!--
  ============================================================
  교재 94~96p | Vue Event Handling - v-on (Code Challenge ①)
  ============================================================
  [핵심] v-on(@) = DOM 요소에 '이벤트 리스너를 등록'하는 지시자

      <button v-on:click="doSomething">클릭</button>   ← 원형
      <button      @click="doSomething">클릭</button>   ← 축약형 (실무 100%)

  ▪ 핸들러 작성 방식 2가지
    1) Inline Handler  : 태그 안에서 즉시 간단한 연산  → @click="count++"
    2) Method Handler  : 복잡한 로직은 script에 함수로 → @click="showAlert"

  ★★ 가장 중요한 개념 — '호출'이 아니라 '등록'이다 ★★
      @click="showAlert"    ← 괄호 없음. 함수의 '참조(주소)'를 넘긴다.
      @click="showAlert()"  ← 괄호 있음. 지금 당장 '실행'해버린다.

    괄호 없이 넘기면 Vue는 내부적으로 이렇게 한다:
        button.addEventListener('click', showAlert)

    즉 우리는 "이 버튼이 눌리면 이 함수를 실행해달라"고 브라우저에
    부탁(등록)만 해두는 것이고, 실제 실행 시점은 사용자가 클릭할 때
    브라우저의 JS 엔진이 결정한다. (강사님 강조 — 첫날 addEventListener 복습)

  ▪ 주요 이벤트
      click / submit / keyup / keydown / input / change / mouseenter / mouseleave
    ※ input  = 입력하는 순간마다 발생
      change = 입력을 마치고 포커스가 빠져나갈 때(focus out) 발생
-->
<script setup>
import { ref } from 'vue'

const count = ref(0)

// 메서드 핸들러 함수 정의 (이름 없는 화살표 함수를 상수에 담는 형태)
const showAlert = () => {
  alert('함수가 성공적으로 호출되었습니다!')
}
</script>

<template>
  <div class="practice-section">
    <h2>v-on 이벤트 핸들링 기초</h2>

    <h3>1) 인라인 연산 처리</h3>
    <p>현재 카운트: {{ count }}</p>
    <!-- 따옴표 안이 JS 공간이므로 count++ 같은 연산을 바로 쓸 수 있다 -->
    <button @click="count++">1씩 증가</button>
    <br />

    <h3>2) 스크립트 함수 호출</h3>
    <!-- 괄호를 붙이지 않는다! 붙이면 페이지 로드 즉시 alert가 떠버린다 -->
    <button @click="showAlert">알림창 띄우기</button>
  </div>
</template>
