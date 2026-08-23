<!--
  ============================================================
  교재 176p / Code Challenge 177p | Scoped Slot — 부모
  ============================================================
  ▸ 부모 쪽 문법
      <Child v-slot="slotBag">
        {{ slotBag.text }}  {{ slotBag.count }}
      </Child>

    v-slot="변수주머니이름" 으로 자식이 보낸 데이터를 통째로 받는다.
    이름은 관례상 slotProps / slotBag 등을 쓴다.
    그 주머니에서 자식이 :text / :count 로 실어보낸 값을 꺼내 쓴다.

  [흐름 정리]
    자식:  <slot :text="message" :count="userCount">
                  ↓ 이 이름들이
    부모:  v-slot="slotBag" → slotBag.text / slotBag.count 로 꺼낸다

  [관찰 포인트]
    · 위 카드 — 부모가 마크업을 주입 → 자식 데이터로 부모가 만든 화면이 보인다
    · 아래 카드 — 부모가 아무것도 안 넣음 → 자식의 fallback 이 보인다
    · '자식 데이터 갱신' 을 누르면 자식이 값을 바꾸고, 그 값이 부모 마크업에 반영된다
      (데이터 주인은 자식, 화면 모양의 주인은 부모)
-->
<script setup>
import SlotScopedChild from './SlotScopedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Scoped Slot 주입 실습</h2>
    <h3>상위 컴포넌트 (Parent)</h3>

    <SlotScopedChild v-slot="slotBag">
      <div class="display-panel">
        <p>알림 메시지: {{ slotBag.text }}</p>
        <p>접속자 수: {{ slotBag.count }}명</p>
      </div>
    </SlotScopedChild>

    <!-- 부모가 마크업을 주지 않으면 자식의 fallback 이 보인다 -->
    <SlotScopedChild> </SlotScopedChild>

    <p class="hint">
      ※ 데이터는 자식이 갖고 있지만, 그 데이터를 <b>어떻게 보여줄지</b>는 부모가 정합니다. 이것이
      Scoped Slot 의 존재 이유입니다.
    </p>
  </div>
</template>

<style scoped>
.display-panel {
  padding: 10px 14px;
  border-left: 3px solid #06b6d4;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 0 6px 6px 0;
}
.hint {
  margin-top: 10px;
  font-size: 0.8rem;
  opacity: 0.65;
}
</style>
