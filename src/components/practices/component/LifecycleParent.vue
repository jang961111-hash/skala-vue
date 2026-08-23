<!--
  ============================================================
  교재 152~155p | Component Lifecycle (부모) — Code Challenge 155p
  ============================================================
  부모는 v-if 로 자식을 붙였다 뗐다 하는 스위치 역할만 한다.
  이래야 Mounting / Unmounting 을 눈으로 볼 수 있다.

  [핵심 관찰] '자식 숨기기' 를 누른 뒤 콘솔을 계속 지켜보세요.
    · onUnmounted 에서 clearInterval 을 하므로 로그가 **완전히 멈춘다**
    · 만약 clearInterval 을 지우면? 자식은 사라졌는데 타이머는 계속 돌아
      "이미 없는 컴포넌트"의 상태를 갱신하려 든다 → 메모리 누수
-->
<script setup>
import { ref } from 'vue'
import LifecycleChild from './LifecycleChild.vue'

const showChild = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>Component Lifecycle Hook</h2>

    <p>
      자식 컴포넌트 상태:
      <strong>{{ showChild ? '표시 중 (Mounted)' : '숨김 (Unmounted)' }}</strong>
    </p>
    <button @click="showChild = !showChild">
      {{ showChild ? '자식 숨기기 (Unmount)' : '자식 표시 (Mount)' }}
    </button>

    <!-- v-if 라서 false 가 되면 DOM 에서 완전히 파괴된다 → onUnmounted 발동
         (v-show 였다면 숨기기만 할 뿐 파괴되지 않아 onUnmounted 가 안 걸린다) -->
    <LifecycleChild v-if="showChild" />

    <p class="hint">
      ※ F12 콘솔을 열고 토글하세요. setup → onMounted → onUpdated(3초마다) → onUnmounted 순서로
      찍힙니다.
    </p>
  </div>
</template>

<style scoped>
.hint {
  margin-top: 12px;
  font-size: 0.8rem;
  opacity: 0.65;
}
</style>
