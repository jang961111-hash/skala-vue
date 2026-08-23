<!--
  ============================================================
  교재 97~100p | Vue Event Handling - Event Object (Code Challenge ②)
  ============================================================
  [핵심] Event Object는 '브라우저가 자동으로 만들어서 넘겨주는 객체'다.

    사용자가 클릭/키입력/마우스이동 등 이벤트를 발생시키면
    → 브라우저가 그 이벤트의 정보를 담은 객체를 생성하고
    → 우리가 등록해둔 핸들러 함수의 첫 번째 인자로 꽂아준다.

  [비유] 초인종이 울렸을 때 같이 오는 '택배 송장'이다.
         누가(target), 언제(timeStamp), 어디서(clientX/Y),
         어떤 방식으로(button, key) 눌렀는지가 전부 적혀 있다.

  ★★ Vue에서 Event 객체를 받는 패턴 2가지 (교재 99p) ★★
    ① 파라미터가 이벤트 객체 하나뿐일 때 → 그냥 함수 이름만 적으면 묵시적으로 전달됨
         @click="handleEvent"          →  const handleEvent = (e) => {...}
    ② 다른 데이터도 같이 넘기고 싶을 때 → $event 를 '명시적으로' 적어야 함
         @click="handleEvent('홍길동', $event)"  →  (name, e) => {...}
       ※ ②에서 $event를 빼먹으면 e가 undefined가 되어 터진다. 가장 흔한 실수.

  ▪ 주요 Properties
      e.target        이벤트를 발생시킨 태그       (e.target.value, e.target.tagName)
      e.currentTarget 리스너가 걸려있는 태그       (버블링 시 e.target과 달라짐)
      e.type          이벤트 종류 (click, keyup...)
      e.clientX / Y   브라우저 화면(Viewport) 기준 좌표
      e.pageX  / Y    전체 문서(Document) 기준 좌표
      e.screenX/ Y    모니터 화면 기준 좌표
      e.button        0:왼쪽 1:휠 2:오른쪽
      e.key / e.code  누른 키의 문자값 / 물리적 자판 위치
      e.shiftKey / e.ctrlKey / e.altKey   조합키를 같이 눌렀는지 (boolean)

  ▪ 주요 Methods
      e.preventDefault()          태그의 기본 동작 차단 (a 이동, form 새로고침)
      e.stopPropagation()         이벤트 버블링 차단
      e.stopImmediatePropagation() 같은 태그의 다른 리스너 실행까지 전부 차단

  [실습 포인트] '클릭 좌표 알아내기'를 화면 위치를 바꿔가며 눌러보면
                clientX/Y 값이 달라지는 것을 확인할 수 있다.
-->
<script setup>
import { ref } from 'vue'

const position = ref('')
const tagName = ref('')

// 패턴 ① 이벤트 객체만 묵시적으로 받는 경우
const getOnlyEvent = (e) => {
  position.value = `좌표: X=${e.clientX}, Y=${e.clientY}`
}

// 패턴 ② 내가 던진 데이터 + 이벤트 객체를 같이 받는 경우
const getWithParam = (name, e) => {
  tagName.value = `대상: ${name} / 클릭된 태그: ${e.target.tagName}`
}
</script>

<template>
  <div class="practice-section">
    <h2>v-on 이벤트 객체($event) 활용</h2>
    <p>좌표: {{ position }}</p>
    <p>태그: {{ tagName }}</p>
    <!-- 패턴 ①: 괄호 없이 이름만 → e가 자동으로 들어온다 -->
    <button @click="getOnlyEvent">클릭 좌표 알아내기</button>
    <!-- 패턴 ②: 인자를 넘기는 순간, $event를 직접 적어줘야 이벤트 객체가 전달된다 -->
    <button @click="getWithParam('회원A', $event)">회원 정보와 태그 확인</button>
  </div>
</template>
