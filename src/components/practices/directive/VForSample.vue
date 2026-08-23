<!--
  ============================================================
  교재 87~88p | Vue Directive - v-for
  ============================================================
  [핵심] 배열이나 객체를 돌면서 태그를 반복 생성한다.

  ▪ 배열 렌더링 (순서 = index 기준)
      v-for="(item, index) in items"
      v-for="item in items"
  ▪ 객체 렌더링 (key 기준)
      v-for="(value, key, index) in object"
      v-for="(value, key) in object"
      v-for="value in object"
    ※ 객체는 (value, key) 순서다. (key, value)가 아니다 — 자주 틀리는 지점.

  ★★ :key 는 선택이 아니라 '필수' ★★
     Vue 엔진이 각 항목을 고유하게 식별하기 위해 반드시 필요하다.
     없으면 에러 또는 성능 저하가 발생한다.

  [무엇을 key로 쓸 것인가 — 강사님 기준]
     · 배열이고 값에 중복 가능성이 있다  → index 사용
     · 항목 자체가 고유하다             → 그 값을 그대로 사용
     · 객체를 순회한다                  → key 자체가 고유하므로 key 사용
     · 배열 안에 객체가 들어있다         → 그 객체의 id 사용   ← 실무에서 가장 흔함
       (백엔드에서 오는 데이터는 대부분 이 JSON 형태다)

  [비유] :key는 반 학생들의 학번이다. 이름은 겹칠 수 있어도 학번은 안 겹친다.
         학번이 있어야 선생님(Vue)이 "누가 바뀌었는지"를 정확히 안다.
-->
<script setup>
import { ref } from 'vue'

const fruits = ref(['사과', '바나나', '딸기'])
const user = ref({
  name: '홍길동',
  age: 25,
  role: '개발자',
})
const items = ref([
  { id: 'prod_101', name: '아이폰' },
  { id: 'prod_102', name: '갤럭시' },
])
</script>

<template>
  <div class="practice-section">
    <h2>v-for 디렉티브 학습</h2>

    <h3>1) 배열 렌더링</h3>
    <!-- index는 0부터 시작하므로, 사람이 읽기 좋게 +1 해서 표시 -->
    <ul>
      <li v-for="(fruit, index) in fruits" :key="index">{{ index + 1 }}번 과일: {{ fruit }}</li>
    </ul>

    <h3>2) 객체 렌더링</h3>
    <!-- 객체는 (value, key, index) 순서. key가 고유하므로 :key="key" -->
    <ul>
      <li v-for="(value, key, index) in user" :key="key">[{{ index }}] {{ key }} : {{ value }}</li>
    </ul>

    <h3>3) 배열 내 객체 렌더링</h3>
    <!-- 실무에서 가장 많이 쓰는 형태. :key는 객체의 고유 id -->
    <ul>
      <li v-for="(item, index) in items" :key="item.id">[{{ index }}] {{ item.name }}</li>
    </ul>
  </div>
</template>
