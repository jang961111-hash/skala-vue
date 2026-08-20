<!--
  ================================================================
  교재 178p 요구사항 2 | BaseDashboardCard.vue
  ================================================================
  ▸ 역할: 검색박스와 리스트박스의 **디자인을 공통화**한 껍데기

  ▸ 왜 slot 인가
    props 로는 "데이터"만 넘길 수 있다. 하지만 여기서 필요한 건
    카드 안에 들어갈 **마크업**이다. 검색창이 들어갈 수도 있고
    날씨 카드 목록이 들어갈 수도 있다.
    → 부모가 마크업을 주입할 수 있게 <slot> 으로 자리를 비워둔다. (173~176p)

  ▸ Named Slot 을 쓴 이유
    카드가 "제목 영역"과 "본문 영역"으로 나뉘므로 슬롯이 2개 필요하다.
      <slot name="header">  → 제목 자리
      <slot>                → 본문 자리 (이름 없는 default 슬롯)

  ▸ fallback
    <slot> 안에 적어둔 내용은 부모가 아무것도 안 넣었을 때 대신 보인다.

  ▸ 이 컴포넌트는 데이터를 전혀 모른다
    weatherList 도, searchQuery 도 모른다. 순수하게 **모양만** 책임진다.
    그래서 어디에든 재사용할 수 있다.
  ================================================================
-->
<script setup>
defineProps({
  // 제목을 간단히 넘길 때 쓰는 용도. header 슬롯을 쓰면 이쪽이 무시된다.
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="dash-card">
    <header v-if="title || $slots.header" class="dash-card-head">
      <!-- 부모가 header 슬롯을 주면 그것을, 안 주면 title props 를 쓴다 -->
      <slot name="header">
        <h3>{{ title }}</h3>
      </slot>
    </header>

    <div class="dash-card-body">
      <slot>
        <p class="fallback">표시할 내용이 없습니다.</p>
      </slot>
    </div>
  </section>
</template>

<style scoped>
/* 요구사항 5: 이 컴포넌트의 디자인은 여기서만 책임진다 */
.dash-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  background: transparent;
}

.dash-card-head {
  padding: 12px 18px;
  border-bottom: 1px solid var(--color-border);
  background: rgba(99, 102, 241, 0.07);
}

.dash-card-head h3 {
  font-size: 0.95rem;
  font-weight: 650;
}

.dash-card-body {
  padding: 16px 18px;
}

.fallback {
  font-size: 0.88rem;
  opacity: 0.6;
}
</style>
