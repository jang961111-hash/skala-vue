<!--
  중간 컴포넌트 — ★ 이 파일이 이 실습의 핵심이다 ★
  props 도 없고 inject 도 없다. 아무것도 하지 않는다.
  그런데도 손자는 조상의 데이터를 받는다.

  props drilling 이었다면 이 파일이
    defineProps(['theme']) 하고  <GrandChild :theme="theme" />
  처럼 **쓰지도 않는 데이터를 중계**해야 했다.
-->
<script setup>
import ProvideInjectGrandChild from './ProvideInjectGrandChild.vue'
</script>

<template>
  <div class="middle">
    <h4>👨 중간 컴포넌트 (Middle)</h4>
    <p class="note">저는 테마를 받지도, 넘기지도 않습니다. 그냥 손자를 품고 있을 뿐입니다.</p>
    <ProvideInjectGrandChild />
  </div>
</template>

<style scoped>
.middle {
  padding: 12px 14px;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
}
.note {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 10px;
}
</style>
