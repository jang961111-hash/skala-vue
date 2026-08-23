<!--
  ============================================================
  교재 85~86p | Vue Directive - v-show (+ v-if 와의 비교)
  ============================================================
  [핵심] 눈에 보이는 결과는 v-if와 똑같지만, 내부 동작이 완전히 다르다.
         v-show는 태그를 지우지 않고 CSS display:none 을 붙였다 뗐다 한다.

  [강사님이 개발자도구로 보여주신 것]
    토글 버튼을 누르면 <div class="box">가 사라지는 게 아니라,
    style="display: none" 이 붙었다 빠졌다 한다.

  ┌──────────────┬─────────────────────┬──────────────────────┐
  │              │ v-if                │ v-show               │
  ├──────────────┼─────────────────────┼──────────────────────┤
  │ 렌더링 방식   │ DOM 파괴/생성        │ CSS display 조작     │
  │ 초기 비용     │ 낮음 (false면 안 그림)│ 높음 (일단 다 그림)  │
  │ 토글 비용     │ 높음 (매번 재건축)   │ 낮음 (CSS 한 줄)     │
  │ v-else 조합   │ ⭕ 가능              │ ❌ 불가능            │
  │ <template>   │ ⭕ 가능              │ ❌ 불가능            │
  │ 선택 기준     │ 전환이 드물 때       │ 전환이 잦을 때       │
  │              │ (권한별 메뉴 등)     │ (모달/탭/아코디언)   │
  └──────────────┴─────────────────────┴──────────────────────┘

  [외울 한 줄] "자주 껐다 켤 거면 v-show, 어차피 안 보여줄 거면 v-if."
-->
<script setup>
import { ref } from 'vue'

const isVisible = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>v-show 디렉티브 학습</h2>
    <button @click="isVisible = !isVisible">화면 토글하기</button>
    <br />
    <div v-show="isVisible" class="box">
      <p>v-show 상자</p>
      <p>조건이 false가 되면 CSS display: none이 붙습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.box {
  padding: 10px;
  margin-top: 5px;
  color: white;
  border-radius: 5px;
  background-color: #3498db; /* 파란색 */
}
</style>
