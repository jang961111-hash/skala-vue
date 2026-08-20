<!--
  ================================================================
  교재 178p 요구사항 3 | SearchBar.vue
  ================================================================
  ▸ props (부모 → 자식)
      searchQuery : 현재 검색어
      onlyRainy   : 강수 필터 상태 (본인 확장분)

  ▸ emits (자식 → 부모)
      update-query : 검색어가 바뀌었음을 알리며 새 값을 실어 보냄
      update-rainy : 강수 필터 토글을 알림 (본인 확장분)

  ★★ 왜 emit 이 반드시 필요한가 ★★
    props 는 **읽기 전용**이다. 자식이 searchQuery 를 직접 바꿀 수 없다.
    (바꾸면 Vue 가 경고를 낸다)
    그래서 "바꿔 주세요" 라고 부모에게 **요청**하는 것이 emit 이다.
    → 데이터의 주인은 끝까지 부모(WeatherParent)다.

  ▸ 116p 과제의 :value + @input 을 그대로 유지한 이유
    v-model 은 IME 조합 가드가 있어 한글이 완성될 때까지 갱신을 미룬다.
    :value + @input 은 조합 중인 자모까지 실시간으로 잡는다.
    컴포넌트로 분리되면서 그 값이 emit 을 타고 부모로 올라갈 뿐,
    입력 처리 방식 자체는 바뀌지 않았다.

  ⚠️ 네이밍 규칙
    선언은 camelCase(searchQuery), 부모의 호출은 kebab-case(:search-query).
    이벤트명도 kebab-case(update-query). 템플릿이 대소문자를 구분하지 않기 때문.
  ================================================================
-->
<script setup>
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
  onlyRainy: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update-query', 'update-rainy'])

// 입력이 일어날 때마다 부모에게 새 값을 실어 보낸다
const onInput = (e) => {
  emit('update-query', e.target.value)
}

const onToggleRainy = (e) => {
  emit('update-rainy', e.target.checked)
}
</script>

<template>
  <div class="search-bar">
    <label for="citySearch" class="sr-label">도시 이름 검색 (한글)</label>
    <input
      id="citySearch"
      type="text"
      placeholder="🔎 도시 이름으로 검색 (예: 서울, 부산)"
      :value="searchQuery"
      @input="onInput"
    />

    <p class="echo">
      입력한 도시명:
      <strong>{{ searchQuery === '' ? '(아직 입력 없음)' : searchQuery }}</strong>
    </p>

    <label class="rainy-toggle">
      <input type="checkbox" :checked="onlyRainy" @change="onToggleRainy" />
      🌧️ 비 오는 지역만 보기
    </label>
  </div>
</template>

<style scoped>
/* 요구사항 5: 검색바 디자인은 이 파일이 책임진다 */
.search-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sr-label {
  font-size: 0.78rem;
  font-weight: 600;
  opacity: 0.75;
}

.search-bar input[type='text'] {
  width: 100%;
  max-width: 340px;
  padding: 9px 14px;
  font-size: 0.95rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: inherit;
}

.search-bar input[type='text']:focus {
  outline: none;
  border-color: #6366f1;
}

.echo {
  font-size: 0.85rem;
}

.rainy-toggle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  align-self: flex-start;
  padding: 5px 12px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 0.85rem;
  cursor: pointer;
}
</style>
