<!--
  ============================================================
  교재 140p | watch() — Array (ref 로 만든 배열)
  ============================================================
  ⚠️ 교재 140p는 항목만 나열된 요약 슬라이드라 예제 코드가 없다.
     134~139p에서 배운 원리(참조 비교 / deep / 화살표 조준)를 배열에 적용한 것이다.

  [출발점] 배열도 결국 **참조 자료형**이다.
           그래서 객체와 똑같은 함정이 그대로 적용된다.

  ┌────────────────────────────────────────────────────────────┐
  │ ① watch(list, ...)                → ❌ push/수정 안 잡힘   │
  │    배열 안을 바꿔도 배열 자체(참조)는 그대로이기 때문       │
  │                                                            │
  │ ② watch(list, ..., { deep: true }) → 🟢 잡힘               │
  │    단, oldVal 이 newVal 과 같아진다 (같은 배열을 가리킴)    │
  │                                                            │
  │ ③ watch(() => list.value.length, ...)  → 🟢 길이만 조준     │
  │    원시값(숫자)을 뽑았으므로 이전 값이 보존된다             │
  │                                                            │
  │ ④ watch(() => list.value[0], ...)      → 🟢 특정 인덱스 조준 │
  │ ⑤ watch(() => list.value[0].name, ...) → 🟢 객체 속성 조준  │
  └────────────────────────────────────────────────────────────┘

  [비유] 배열은 **번호표가 붙은 사물함 줄**이다.
         줄 자체를 감시하면 "줄이 통째로 교체됐는지"만 본다.
         안에 뭐가 들어왔는지 알려면 deep(전체 열어보기)이거나,
         특정 사물함 번호를 콕 집어 지켜봐야 한다.

  [실습 순서]
    1. '항목 추가' → ② deep 과 ③ 길이 모니터가 반응. ③만 "2 ➡️ 3" 처럼 과거 표시
    2. '첫 항목 이름 변경' → ② deep 과 ⑤ 속성 모니터가 반응, ③ 길이는 무반응
       (길이는 안 바뀌었으므로)
-->
<script setup>
import { ref, watch } from 'vue'

// 객체를 담은 배열 (실무에서 가장 흔한 형태 — 백엔드 JSON이 대개 이렇다)
const memberList = ref([
  { id: 1, name: '홍길동', role: '개발자' },
  { id: 2, name: '이순신', role: '기획자' },
])

const logDeep = ref('대기 중...')
const logLength = ref('대기 중...')
const logFirstName = ref('대기 중...')

// ② 배열 전체를 deep 으로 감시 — 무엇이 바뀌든 잡히지만 과거는 못 본다
watch(
  memberList,
  (newVal) => {
    logDeep.value = `[deep 감지] 현재 ${newVal.length}명 / 첫 번째: ${newVal[0]?.name ?? '(없음)'}`
  },
  { deep: true },
)

// ③ 길이만 조준 — 원시값이라 이전 값이 보존된다
watch(
  () => memberList.value.length,
  (newLen, oldLen) => {
    logLength.value = `[길이 조준] 인원이 ${oldLen}명 ➡️ ${newLen}명으로 변경됨`
  },
)

// ⑤ 첫 번째 객체의 name 속성만 조준
watch(
  () => memberList.value[0]?.name,
  (newName, oldName) => {
    logFirstName.value = `[속성 조준] 첫 번째 이름이 "${oldName}" ➡️ "${newName}" 으로 변경됨`
  },
)

let seq = 3
const addMember = () => {
  // push 는 배열 내부를 바꾼다 → deep 이나 length 조준으로만 잡힌다
  memberList.value.push({ id: seq, name: `신입${seq}`, role: '신입' })
  seq++
}
const renameFirst = () => {
  memberList.value[0].name = memberList.value[0].name === '홍길동' ? '장보고' : '홍길동'
}
const removeLast = () => {
  if (memberList.value.length > 1) memberList.value.pop()
}
</script>

<template>
  <div class="practice-section">
    <h2>ref 배열 감시 (Array)</h2>

    <h3>👥 회원 목록 ({{ memberList.length }}명)</h3>
    <ul>
      <li v-for="m in memberList" :key="m.id">{{ m.name }} — {{ m.role }}</li>
    </ul>
    <button @click="addMember">항목 추가</button> &nbsp;
    <button @click="renameFirst">첫 항목 이름 변경</button> &nbsp;
    <button @click="removeLast">마지막 항목 삭제</button>

    <div class="monitor">
      <p>👁️‍🗨️ ② 배열 전체 deep 감시</p>
      <p>{{ logDeep }}</p>
      <small>※ 무엇이 바뀌든 잡히지만 이전 값은 알 수 없다.</small>
    </div>

    <div class="monitor target">
      <p>🎯 ③ 길이(length)만 조준</p>
      <p>{{ logLength }}</p>
      <small>※ 이름만 바꾸면 반응하지 않는다.</small>
    </div>

    <div class="monitor target">
      <p>🎯 ⑤ 첫 항목의 name 속성만 조준</p>
      <p>{{ logFirstName }}</p>
      <small>※ 항목을 추가해도 첫 이름이 그대로면 반응하지 않는다.</small>
    </div>
  </div>
</template>

<style scoped>
.monitor {
  margin-top: 12px;
  padding: 12px 16px;
  border-left: 3px solid #42b883;
  background: rgba(66, 184, 131, 0.08);
  border-radius: 0 6px 6px 0;
}
.monitor.target {
  border-left-color: #f39c12;
  background: rgba(243, 156, 18, 0.1);
}
.monitor small {
  opacity: 0.7;
}
</style>
