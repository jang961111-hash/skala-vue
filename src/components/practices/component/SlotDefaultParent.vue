<!--
  ============================================================
  교재 174p / Code Challenge 177p | Default Slot — 부모
  ============================================================
  ⚠️ 자식을 부를 때 **자체 닫는 태그(<Child />)를 쓰면 안 된다.**
     여는 태그와 닫는 태그로 분리하고 그 사이에 콘텐츠를 넣어야 slot 이 채워진다.

       <SlotDefaultChild>  ...여기에 넣은 것이 slot 자리로 간다...  </SlotDefaultChild>

  [관찰 포인트] 아래 3개 카드를 비교하세요.
    1번 — 문장 하나 주입
    2번 — 제목 + 버튼 (마크업 여러 개도 통째로 들어간다)
    3번 — **아무것도 안 넣음** → 자식의 fallback 이 대신 보인다
-->
<script setup>
import SlotDefaultChild from './SlotDefaultChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Default Slot 레이아웃 주입 실습</h2>

    <SlotDefaultChild>
      <p>단순한 텍스트 문장을 주입합니다.</p>
    </SlotDefaultChild>

    <SlotDefaultChild>
      <h3 style="color: #e74c3c">🔥 경고 상태</h3>
      <button>확인</button>
    </SlotDefaultChild>

    <!-- 비워두면 자식의 <slot> 안 fallback 이 표시된다 -->
    <SlotDefaultChild> </SlotDefaultChild>

    <p class="hint">※ 3번째 카드는 부모가 아무것도 주입하지 않아 자식의 기본값이 보입니다.</p>
  </div>
</template>

<style scoped>
.hint {
  margin-top: 10px;
  font-size: 0.8rem;
  opacity: 0.65;
}
</style>
