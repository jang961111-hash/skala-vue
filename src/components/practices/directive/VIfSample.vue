<!--
  ============================================================
  교재 84p | Vue Directive - v-if / v-else-if / v-else
  ============================================================
  [핵심] 조건에 따라 태그를 "DOM에 그릴지 말지" 결정한다.
         false면 화면에서 숨기는 게 아니라, 아예 존재하지 않는다.

  [강사님이 개발자도구로 보여주신 것]
    로그인 버튼을 누르면 <p>의 '내용'이 바뀌는 게 아니라,
    위쪽 <p>가 사라지고 아래쪽 <p>가 새로 생기는 것이다.
    → 같은 <p>라서 헷갈리지만, DOM 트리의 '다른 엘리먼트'다.

  [비유] 손님이 오면 의자를 갖다 놓고, 가면 의자를 치운다.
         (v-show는 반대로, 의자는 늘 있고 천으로 덮었다 걷었다 한다.)

  [문법 규칙] v-if / v-else-if / v-else 는 반드시 '형제 태그로 연속'해야 한다.
              중간에 다른 태그가 끼면 v-else가 짝을 못 찾아 에러가 난다.

  [관찰 포인트 2번] 점수를 70 → 90 으로 바꿔가며 개발자도구를 보면
    style="color: orange" 인 div가 통째로 사라지고
    style="color: green" 인 div가 새로 생기는 것이 보인다.
-->
<script setup>
import { ref } from 'vue'

// 1. 조건부 온/오프 스위치 변수
const isLogged = ref(false)
// 2. 다중 조건 분기용 숫자 변수
const score = ref(85)
</script>

<template>
  <div class="practice-section">
    <h2>v-if, v-else-if, v-else 디렉티브 학습</h2>
    <h3>1) 기본 로그인 상태 스위치</h3>
    <p v-if="isLogged">환영합니다! 회원 전용 화면입니다.</p>
    <p v-else>로그인이 필요합니다. 먼저 로그인해 주세요.</p>
    <!-- 버튼 '글자'까지 삼항연산자로 함께 바뀐다 (Text Interpolation + 표현식) -->
    <button @click="isLogged = !isLogged">
      {{ isLogged ? '로그아웃 하기' : '로그인 하기' }}
    </button>
    <br />
    <h3>2) 성적별 학점 등급 측정 (다중 조건문)</h3>
    <label>현재 점수 입력: </label>
    <input type="number" v-model="score" min="0" max="100" step="5" />
    <br />
    <div v-if="score >= 90" style="color: green; font-weight: bold">
      합격 등급: A 학점 (훌륭합니다!)
    </div>
    <div v-else-if="score >= 80" style="color: blue">합격 등급: B 학점 (양호합니다.)</div>
    <div v-else-if="score >= 70" style="color: orange">합격 등급: C 학점 (조금 더 분발하세요.)</div>
    <div v-else style="color: red; font-weight: bold">합격 등급: F 학점 (재시험 대상입니다.)</div>
  </div>
</template>
