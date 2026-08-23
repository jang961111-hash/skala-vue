<!--
  ============================================================
  교재 77p | Vue Directive - v-bind (기본)
  ============================================================
  [핵심] v-bind = HTML 태그의 '속성(Attribute)'에 JS 값을 연결하는 지시자

    <div v-bind:[속성]="[Vue data]"></div>
    <div        :[속성]="[Vue data]"></div>   ← 실무 100% 축약형

  [가장 중요한 개념 — 강사님 강조]
    콜론(:)이 붙는 순간, 따옴표 안은 '문자열'이 아니라
    'JavaScript가 동작하는 공간'으로 성격이 바뀐다.

      href="dynamicUrl"    → 진짜 "dynamicUrl" 이라는 주소로 감 (문자열)
      :href="dynamicUrl"   → dynamicUrl 변수의 값으로 감 (변수)

  [비유] 콜론(:)은 '이건 이름표가 아니라 실제 물건이야'라는 표시다.
         택배 상자에 "사과"라고 쓰면 글자지만,
         콜론을 붙이면 진짜 사과가 들어있는 것이다.

  [관찰 포인트] isButtonDisabled 만 ref로 감쌌다.
    → 값이 바뀌어야 화면이 반응해야 하는 것만 ref로 감싼다.
      dynamicUrl / logoImgSrc는 끝까지 안 바뀌므로 일반 상수로 둔다.
      (ref는 Vue가 계속 감시해야 해서 메모리 비용이 있다 — 강사님 설명)
-->
<script setup>
import { ref } from 'vue'

const dynamicUrl = 'https://www.naver.com'
const logoImgSrc = 'https://vuejs.org/images/logo.png'
const isButtonDisabled = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 기본 (축약형: 콜론)</h2>
    <h3>1) 동적 링크 연결</h3>
    <a :href="dynamicUrl">여기를 클릭하면 네이버로 이동합니다</a>
    <br />

    <h3>2) 동적 이미지 연결</h3>
    <img :src="logoImgSrc" alt="Vue 로고" style="width: 100px" />
    <br />

    <h3>3) 버튼 비활성화 제어</h3>
    <p>현재 버튼 사용 불가능 상태: {{ isButtonDisabled }}</p>
    <button :disabled="isButtonDisabled">동의해야 클릭할 수 있는 버튼</button>&nbsp;
    <!-- !isButtonDisabled 를 다시 대입 = 토글(toggle) 패턴. Vue가 아니라 순수 JS 문법이다 -->
    <button @click="isButtonDisabled = !isButtonDisabled">위 버튼 잠금 해제/토글하기</button>
  </div>
</template>
