<!--
  ============================================================
  교재 90p | Vue Directive - v-cloak
  ============================================================
  [핵심] 데이터 바인딩이 끝나기 전에 {{ message }} 같은
         '해석 안 된 뼈대 문자열'이 잠깐 노출되는 현상(FOUC)을 막는다.

  [반드시 짝이 필요하다]
    v-cloak은 혼자서는 아무 일도 하지 않는다.
    CSS 속성 선택자 [v-cloak] { display: none; } 이 반드시 같이 있어야 한다.

  [동작 순서]
    1. HTML 로딩 → 태그에 v-cloak 속성이 붙어 있음 → CSS가 숨김
    2. Vue 렌더링 완료 → Vue가 v-cloak 속성을 자동으로 제거
    3. CSS 선택자가 더 이상 안 걸림 → 화면에 나타남

  [현실] 네트워크가 아주 느린 환경에서만 발생한다.
         강사님도 "저도 실제로 본 적은 없다"고 하실 만큼 요즘은 보기 어렵다.
         Vite 빌드 환경에서는 사실상 필요 없다.

  [중요도] 낮음. (강사님)
-->
<script setup>
import { ref } from 'vue'

const message = ref('느린 네트워크에서도 안전하게 출력되는 메시지!')
</script>

<template>
  <div v-cloak class="practice-section">
    <h2>v-cloak 디렉티브 학습</h2>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
/* ⚠️ 필수: Vue가 로딩되기 전까지 해당 구역을 물리적으로 숨기는 CSS 규칙 */
[v-cloak] {
  display: none !important;
}
</style>
