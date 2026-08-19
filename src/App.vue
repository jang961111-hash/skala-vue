<!--
  ============================================================
  App.vue | Root Component
  ============================================================
  교재 68p "App.vue 비우기" → 69p "App.vue 샘플 작성" 순서대로,
  기본 스캐폴드(로고 / HelloWorld / RouterLink)를 걷어내고
  과제 컴포넌트를 자식으로 갈아 끼운 상태입니다.

  ※ 원래 스캐폴드 내용은 initial commit(3184014)에 남아 있으므로
    되돌리려면:  git checkout 3184014 -- src/App.vue
  ============================================================
-->
<script setup>
import WeatherMockup from './components/handson/WeatherMockup.vue'
</script>

<template>
  <div style="padding: 20px">
    <WeatherMockup />
  </div>
</template>
