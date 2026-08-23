<!--
  ============================================================
  교재 101~104p | Vue Event Handling - Event Modifier (Code Challenge ③)
  ============================================================
  [핵심] 수식어(Modifier)는 '자주 쓰는 이벤트 처리 코드'를 점(.) 하나로 줄인 문법 설탕이다.

  ★★ 강사님이 수업 중 질문으로 던지신 것 — 수식어 없이 짜면? ★★

    @click.prevent="handleLink"          ←  수식어 사용

    ↕ 완전히 동일한 동작

    @click="handleLink"
    const handleLink = (e) => {          ←  이벤트 객체를 파라미터로 받고
      alert('...')
      e.preventDefault()                 ←  직접 호출해줘야 한다
    }

    즉 수식어가 없어도 다 할 수 있다. 다만 너무 자주 쓰이니까 뽑아둔 것.
    → 그래서 Event Object를 먼저 이해해야 수식어가 이해된다.

  ▪ 주요 수식어와 실제 매핑
      .prevent  → e.preventDefault()            기본 동작 차단
      .stop     → e.stopPropagation()           버블링 차단
      .once     → 1회 실행 후 removeEventListener
      .self     → e.target === e.currentTarget  자기 자신 클릭 시에만

  ▪ 왜 .prevent가 중요한가? (강사님 설명)
      SPA에서 <form>을 submit하면 원래는 action URL로 페이지가 통째로 넘어간다.
      하지만 우리는 폼 데이터를 JSON으로 만들어 API로 보내고 응답을 받아야 한다.
      → 그래서 SPA에서 submit / <a> 태그에는 .prevent 를 거의 항상 붙인다.

  ▪ 버블링(Bubbling)이란? (첫날 복습)
      div 안에 button이 있고 둘 다 클릭 이벤트가 걸려 있으면,
      button을 눌렀을 때 button → div 순서로 '안에서 바깥으로' 이벤트가 퍼진다.
      반대 방향(바깥 → 안)은 캡처링(Capturing). 기본값은 버블링이다.
      ※ addEventListener의 세 번째 인자(true/false)가 바로 이 캡처링 여부다.

  ▪ 그 외 수식어 (교재 103~104p)
      공통   .capture .passive
      키보드 .enter .tab .delete .esc .space .up .down .left .right
      시스템 .ctrl .alt .shift .meta .exact
      마우스 .left .right .middle
    → 이것들 덕분에 웹앱을 CS(클라이언트/서버) 프로그램처럼 키보드로 조작할 수 있다.
      비즈니스 애플리케이션에서 특히 많이 쓰인다. (강사님)

  [실습 순서]
    1. '네이버 링크' 클릭 → alert만 뜨고 페이지 이동은 안 된다 (.prevent)
    2. '버블링 발생 버튼' 클릭 → alert가 2번 뜬다 (자식 → 부모)
    3. '버블링 차단 버튼' 클릭 → alert가 1번만 뜬다 (.stop)
-->
<script setup>
const handleLink = () => {
  alert('수식어 덕분에 네이버로 이동하지 않고 함수만 실행됩니다!')
}
const handleBox = () => {
  alert('부모 박스가 클릭되었습니다!')
}
const handleChild1 = () => {
  alert('1번 자식 클릭!')
}
const handleChild2 = () => {
  alert('2번 자식(나만 켜짐) 클릭!')
}
</script>

<template>
  <div class="practice-section">
    <h2>이벤트 수식어(Modifiers) 학습</h2>

    <h3>1) .prevent (기본 동작 막기)</h3>
    <!-- href는 그대로 있지만 .prevent가 a 태그의 '이동' 기본 동작을 막는다 -->
    <a href="https://www.naver.com" @click.prevent="handleLink">네이버 링크</a>
    <br />

    <h3>2) .stop (이벤트 버블링 막기)</h3>
    <div @click="handleBox" style="padding: 20px; background-color: #eee">
      <p>부모 영역 (클릭 시 alert 발동)</p>
      <!-- 자식 → 부모 순서로 alert가 2번 뜬다 -->
      <button @click="handleChild1">버블링 발생 버튼</button>
      <!-- .stop 덕분에 자식에서 멈춘다. alert 1번 -->
      <button @click.stop="handleChild2">버블링 차단 버튼</button>
    </div>
  </div>
</template>
