<!--
  ============================================================
  교재 78~79p | Vue Directive - v-bind : Class Binding
  ============================================================
  [핵심] 클래스 바인딩은 '패턴'을 외우는 것이 이해의 지름길이다 (강사님 강조)

  ┌ 객체(Object) 구문 ─────────────────────────────────────┐
  │  :class="{ '클래스명': 조건불리언변수 }"                  │
  │  → 조건이 true일 때만 그 클래스를 붙인다.                 │
  └────────────────────────────────────────────────────────┘
  ┌ 배열(Array) 구문 ──────────────────────────────────────┐
  │  :class="[기본클래스변수, 조건 ? '클래스A' : '클래스B']"   │
  │  → 여러 클래스를 동시에 엮거나, 삼항연산자로 갈아끼운다.   │
  └────────────────────────────────────────────────────────┘

  [헷갈림 방지 — 어디가 클래스명이고 어디가 변수인가?]
      :class="{ 'text-danger': isWarning }"
                 ↑ CSS 클래스명      ↑ JS 변수
      :class="[themeClass, isWarning ? 'border-red' : 'border-gray']"
                ↑ JS 변수            ↑ JS 변수    ↑ 클래스명  ↑ 클래스명

  [실무 권장도] 클래스 바인딩 ⭐⭐⭐ (90%) vs 스타일 바인딩 ⭐⭐ (10%)
    구조(HTML)와 스타일(CSS)을 분리해두는 쪽이 유지보수에 압도적으로 유리하다.

  [scoped] <style scoped>를 쓰면 이 CSS가 이 컴포넌트 안에서만 적용된다.
           다른 컴포넌트의 .text-danger 와 충돌하지 않는다.
-->
<script setup>
import { ref } from 'vue'

const isWarning = ref(false) // 객체 바인딩용 스위치
const themeClass = ref('bg-dark') // 배열 바인딩용 고정 클래스
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급 (클래스 바인딩)</h2>
    <h3>클래스 바인딩 (객체 형식)</h3>
    <p :class="{ 'text-danger': isWarning }">현재 경고 상태: {{ isWarning }}</p>
    <button @click="isWarning = !isWarning">경고 상태 토글</button>
    <br />
    <h3>클래스 바인딩 (배열 형식)</h3>
    <div :class="[themeClass, isWarning ? 'border-red' : 'border-gray']">
      다중 클래스가 조립된 박스 구역입니다.
    </div>
  </div>
</template>

<style scoped>
.text-danger {
  color: red;
  font-weight: bold;
}
.bg-dark {
  background-color: #333;
  color: white;
  padding: 15px;
}
.border-red {
  border: 3px solid red;
}
.border-gray {
  border: 3px solid #ccc;
}
</style>
