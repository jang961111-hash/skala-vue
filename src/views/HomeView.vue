<!--
  ================================================================
  HomeView.vue | 라우트 "/" 의 화면
  ================================================================
  교재 116p 과제인 WeatherMockup 을 이 라우트에 마운트한다.
  스캐폴딩 기본값이던 TheWelcome 은 걷어냈다.
  ================================================================
-->
<script setup>
import WeatherMockup from '../components/handson/WeatherMockup.vue'
</script>

<template>
  <main>
    <WeatherMockup />
  </main>
</template>
