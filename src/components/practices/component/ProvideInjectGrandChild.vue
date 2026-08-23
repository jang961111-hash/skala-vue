<!-- 손자 컴포넌트 — 조상이 provide 한 값을 중간을 거치지 않고 바로 받는다 -->
<script setup>
import { inject } from 'vue'

// 조상이 provide('글로벌테마', ...) 한 것을 키로 꺼낸다.
// ⚠️ props 와 달리 타입 체크도, 필수 여부 선언도 없다 → 추적이 어렵다는 단점
const theme = inject('글로벌테마')
const changeTheme = inject('테마변경함수')
</script>

<template>
  <div class="grandchild" :class="theme">
    <h4>👶 손자 컴포넌트 (GrandChild)</h4>
    <p>
      inject 로 받은 테마: <strong>{{ theme }}</strong>
    </p>
    <p class="note">부모(중간)는 이 값을 전혀 몰라도 됩니다.</p>
    <button @click="changeTheme">손자가 테마 변경 (함수도 내려받음)</button>
  </div>
</template>

<style scoped>
.grandchild {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}
.grandchild.dark {
  background: #16242f;
  color: #e6eef3;
}
.grandchild.light {
  background: #fdfdfb;
  color: #16202b;
}
.note {
  font-size: 0.8rem;
  opacity: 0.7;
}
</style>
