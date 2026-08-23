<!--
  ============================================================
  교재 169~171p | Provide & Inject
  ============================================================
  ★ 해결하려는 문제 — Props Drilling ★

    조상 → 부모 → 자식 → 손자 처럼 계층이 깊어지면,
    최상위와 최하위가 데이터를 주고받을 방법이 없다.
    중간 컴포넌트들이 **그 데이터를 쓰지도 않으면서** props/emits 를
    계속 뚫어(중계해)줘야 한다. → 이것이 props drilling.

  ┌─────────────────────────────────────────────────────────┐
  │  provide('키', 데이터)   조상의 <script setup> 에서 제공   │
  │  inject('키')            자손이 몇 단계 아래든 바로 수신    │
  │                          중간 컴포넌트는 아무것도 안 해도 됨 │
  └─────────────────────────────────────────────────────────┘

  ▪ provide 는 두 레벨에서 가능
      ⓐ 특정 조상의 <script setup> 안 → 그 아래 자손만 사용 가능 (이 실습)
      ⓑ main.js 에서 app.provide(...)   → 앱 전체 모든 컴포넌트에서 사용 가능

  ▪ props 와의 차이 (중요)
      props  : 자식이 "이 데이터가 필요하다"고 **명시적으로 선언**(defineProps)
               → 타입 체크·필수 여부 검증 가능, 추적이 쉽다
      inject : 그런 선언이 없다
               → 편하지만 **어디서 온 값인지 추적하기 어렵다**

  ▪ 언제 쓰나 / 언제 안 쓰나
      값만 내려주는 간단한 경우 → provide/inject 로 충분
      computed·값 변경 함수까지 필요 → **스토어(Pinia)** 가 낫다
      실무에서는 대부분 스토어로 대체하지만,
      특정 라인만 국소적으로 내려줄 때는 여전히 쓰인다.

  [비유] props drilling 이 **옆집을 하나하나 거쳐 물건을 전달하는 것**이라면,
         provide/inject 는 **건물 방송**이다. 방송을 튼 층 아래로는
         중간 층이 뭘 하든 상관없이 다 들린다.

  [관찰 포인트]
    · 손자의 버튼을 눌러 테마를 바꿔보세요.
    · 중간 컴포넌트(Middle)는 코드에 theme 이라는 단어조차 없습니다.
-->
<script setup>
import { ref, provide } from 'vue'
import ProvideInjectMiddle from './ProvideInjectMiddle.vue'

const theme = ref('light')

const changeTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 키 이름으로 데이터를 제공한다. 아래 자손 전부가 inject 로 꺼내 쓸 수 있다.
provide('글로벌테마', theme)
// 값뿐 아니라 함수도 내려줄 수 있다 (자손이 조상의 상태를 바꾸게 하는 방법)
provide('테마변경함수', changeTheme)
</script>

<template>
  <div class="practice-section">
    <h2>Provide &amp; Inject (Props Drilling 해결)</h2>

    <div class="parent">
      <h3>👴 조상 컴포넌트 (Parent) — provide 하는 쪽</h3>
      <p>
        현재 테마: <strong>{{ theme }}</strong>
      </p>
      <button @click="changeTheme">조상이 직접 테마 변경</button>
      <ProvideInjectMiddle />
    </div>

    <p class="hint">
      ※ 조상 → 중간 → 손자 3단 구조입니다. 중간 컴포넌트는 theme 을 전혀 모르는데도 손자가 값을 받아
      씁니다. props 였다면 중간이 반드시 중계해야 했습니다.
    </p>
  </div>
</template>

<style scoped>
.parent {
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hint {
  margin-top: 12px;
  font-size: 0.8rem;
  opacity: 0.65;
}
</style>
