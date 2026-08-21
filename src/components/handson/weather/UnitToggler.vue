<!--
  ================================================================
  교재 212p 요구사항 1·2 | UnitToggler.vue
  ================================================================
  ▸ 요구사항 1: 단위 설정을 변경하는 UI 버튼과 영역
    요구사항 2: Navigation Bar 옆에 배치

  ▸ 이 컴포넌트에는 props 도 emits 도 없다
      부모에게서 값을 받지도, 부모에게 알리지도 않는다.
      **스토어를 직접 읽고 직접 바꾼다.**

      → 이것이 스토어의 효과다. App.vue 의 네비게이션 바에 놓여 있지만,
        대시보드 카드나 상세 페이지와 아무런 부모-자식 관계가 없어도
        같은 값을 공유한다.

  ▸ storeToRefs 를 쓰지 않은 이유 (교재 205p)
      템플릿에서 configStore.unitSymbol 처럼 **스토어 객체를 통해** 접근하면
      구조분해를 하지 않은 것이므로 반응성이 유지된다.
      구조분해로 꺼낼 때만 storeToRefs 가 필요하다.
  ================================================================
-->
<script setup>
import { useConfigStore } from '../../../stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="label">단위</span>

    <div class="seg">
      <button
        type="button"
        :class="{ on: configStore.unit === 'celsius' }"
        @click="configStore.setUnit('celsius')"
      >
        ℃
      </button>
      <button
        type="button"
        :class="{ on: configStore.unit === 'fahrenheit' }"
        @click="configStore.setUnit('fahrenheit')"
      >
        ℉
      </button>
    </div>

    <!-- 요구사항의 toggleUnit action 도 그대로 쓸 수 있게 둔다 -->
    <button type="button" class="swap" :title="`현재 ${configStore.unitLabel}`" @click="configStore.toggleUnit">
      ⇄
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 0.74rem;
  opacity: 0.6;
}

.seg {
  display: inline-flex;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  overflow: hidden;
}

.seg button {
  padding: 4px 12px;
  font-size: 0.85rem;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.seg button.on {
  background: #6366f1;
  color: #fff;
  font-weight: 700;
}

.swap {
  padding: 3px 9px;
  font-size: 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
</style>
