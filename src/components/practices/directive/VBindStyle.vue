<!--
  ============================================================
  교재 80~82p | Vue Directive - v-bind : Style Binding
  ============================================================
  [핵심] 인라인 style도 객체/배열로 제어할 수 있다.

  ┌ 객체(Object) 구문 ─────────────────────────────────────┐
  │  :style="{ CSS속성명: JS변수 }"                          │
  │  <p :style="{ color: activeColor, fontSize: fontSize + 'px' }">│
  └────────────────────────────────────────────────────────┘
  ┌ 배열(Array) 구문 ──────────────────────────────────────┐
  │  :style="[스타일객체A, 스타일객체B]"  → 여러 객체를 병합  │
  └────────────────────────────────────────────────────────┘

  [헷갈림 방지 — 어디가 CSS 속성이고 어디가 변수인가?]
      :style="{ color: textColor, fontWeight: 'bold' }"
                 ↑CSS속성  ↑JS변수   ↑CSS속성    ↑그냥 문자열
    앞(key)이 CSS 속성, 뒤(value)가 JS 값이다.

  [표기법] key는 camelCase 권장 (backgroundColor).
           'kebab-case'도 되지만 따옴표로 감싸야 한다 ('background-color').
    ※ 케이스 표기법 3종 (강사님 퀴즈)
        camelCase   : fontSize        (첫 글자 소문자, 이후 단어 첫 글자 대문자)
        PascalCase  : FontSize        (첫 글자부터 대문자 — 컴포넌트 이름 규칙)
        kebab-case  : font-size       (전부 소문자 + 하이픈)

  [중요] baseBoxStyle은 '객체'인데 ref로 감쌌다.
         ref는 숫자/문자/불리언뿐 아니라 객체와 배열도 감쌀 수 있다. (강사님 강조)
-->
<script setup>
import { ref } from 'vue'

// 1. 객체 바인딩용 변수
const textColor = ref('purple')
const boxWidth = ref(150) // 숫자만 제어 ('px'는 template에서 붙인다
// 2. 배열 바인딩용 스타일 객체 무더기
const baseBoxStyle = ref({
  backgroundColor: '#42b883',
  height: '100px',
  transition: 'all 0.3s ease', // 부드러운 애니메이션 효과
})
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급 (스타일 바인딩)</h2>
    <h3>1) 인라인 스타일 변수 조작 (객체 형식)</h3>
    <p :style="{ color: textColor, fontWeight: 'bold' }">이 글자의 색상은 실시간으로 바뀝니다.</p>
    <!-- 삼항연산자로 두 값을 왕복시키는 토글 -->
    <button @click="textColor = textColor === 'purple' ? 'blue' : 'purple'">글자 색상 토글</button>
    <br />

    <h3>2) 다중 스타일 객체 조립 (배열 형식)</h3>
    <label>박스 가로 크기(px): </label>
    <input type="number" v-model="boxWidth" step="50" />
    <br />
    <!-- baseBoxStyle(고정 스타일 묶음) + 실시간 계산된 width 를 하나로 병합 -->
    <div :style="[baseBoxStyle, { width: boxWidth + 'px' }]">
      <p style="color: white; padding: 10px; text-align: center">
        가로 크기: {{ boxWidth }}px 박스
      </p>
    </div>
  </div>
</template>
