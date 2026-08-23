<!--
  ============================================================
  교재 175p / Code Challenge 177p | Named Slot — 부모
  ============================================================
  부모는 v-slot 디렉티브로 어느 슬롯에 넣을지 지정한다.

    <template v-slot:header> ...header 슬롯으로 갈 내용... </template>
    ...이름 지정 없이 남긴 것은 default 슬롯으로 들어간다...

  ▸ 축약형도 있다:  v-slot:header  ⟶  #header
    (교재는 원형을 쓰므로 여기서도 원형을 따른다)
-->
<script setup>
import SlotNamedChild from './SlotNamedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Named Slot 주입 실습</h2>

    <SlotNamedChild>
      <template v-slot:header>
        <h3>Child 주입 제목</h3>
      </template>

      <!-- v-slot 지정 없이 남긴 것은 자동으로 default 슬롯으로 들어간다 -->
      <p>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt..."
      </p>
    </SlotNamedChild>

    <p class="hint">
      ※ 회색 헤더 영역이 header 슬롯, 아래 흰 영역이 default 슬롯입니다. 자식이 만든 뼈대에 부모의
      마크업이 각각 꽂힌 것입니다.
    </p>
  </div>
</template>

<style scoped>
.hint {
  margin-top: 10px;
  font-size: 0.8rem;
  opacity: 0.65;
}
</style>
