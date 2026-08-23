<!--
  ============================================================
  교재 140p | watch() — Array (reactive 로 만든 배열)
  ============================================================
  ⚠️ 교재 140p는 항목만 나열된 요약 슬라이드라 예제 코드가 없다.
     123p(reactive 단절)와 137~139p(reactive watch 규칙)를 배열에 적용한 것이다.

  [ref 배열과의 결정적 차이]

      ref 배열      : watch(list, ...)  → ❌ { deep: true } 를 켜야 잡힌다
      reactive 배열 : watch(list, ...)  → 🟢 **deep 이 자동으로 켜진다**

  단, 대가가 있다. 137~139p에서 본 것과 똑같다.
      → oldVal 과 newVal 이 **같은 배열**을 가리키므로 과거를 보존하지 못한다.

  ★★ reactive 배열의 함정 — 재할당 금지 ★★

      const items = reactive(['사과', '바나나'])

      items = ['포도']       // ❌ 반응성 연결이 끊어진다 (123p)
      items.push('포도')      // 🟢 내부 조작은 안전
      items.splice(0, 1)      // 🟢
      items.length = 0        // 🟢 비우기도 이 방식으로

  [비유] reactive 배열은 **벽에 고정된 책장**이다.
         책을 꽂고 빼는 건(push/splice) 다 감지되지만,
         책장 자체를 다른 책장으로 바꾸면 감시 카메라는 옛 책장만 계속 본다.

  [실습 포인트]
    · '항목 추가' → ① 자동 deep 이 반응. 이전/현재 개수가 **같게** 찍힌다
    · ② 길이 조준은 원시값이라 과거가 보존된다
    · '❌ 재할당 시도' → 아무 반응이 없다 (반응성이 끊긴 증거)
-->
<script setup>
import { reactive, ref, watch } from 'vue'

// reactive 로 만든 배열
const taskList = reactive([
  { id: 1, title: '교재 145p 과제', done: true },
  { id: 2, title: '교재 178p 과제', done: false },
])

const logAutoDeep = ref('대기 중...')
const logLength = ref('대기 중...')
const logBroken = ref('아직 시도하지 않음')

// ① reactive 는 변수명 그대로 감시해도 deep 이 자동 작동한다
watch(taskList, (newVal, oldVal) => {
  // ⚠️ newVal 과 oldVal 이 같은 배열이라 개수가 똑같이 찍힌다
  logAutoDeep.value = `[자동 deep] 이전개수인척하는:${oldVal.length} ➡️ 현재개수:${newVal.length}`
})

// ② 길이만 조준하면 원시값이라 과거가 보존된다
watch(
  () => taskList.length,
  (newLen, oldLen) => {
    logLength.value = `[길이 조준] 진짜 과거 보존! ${oldLen}개 ➡️ ${newLen}개`
  },
)

let seq = 3
const addTask = () => {
  taskList.push({ id: seq, title: `새 할 일 ${seq}`, done: false })
  seq++
}
const toggleFirst = () => {
  taskList[0].done = !taskList[0].done
}
const removeLast = () => {
  if (taskList.length > 1) taskList.splice(taskList.length - 1, 1)
}

// ❌ 재할당은 반응성을 끊는다 — 왜 안 되는지 눈으로 확인하기 위한 버튼
//    (const 라서 실제 재할당은 못 한다. 그것 자체가 방어책이기도 하다)
const tryReassign = () => {
  logBroken.value =
    'reactive 배열은 const 로 선언하므로 재할당 자체가 막힌다. ' +
    'let 으로 선언해 taskList = [...] 를 하면 컴파일은 되지만 화면이 멈춘다. ' +
    '→ 항상 push / splice 로 조작할 것 (교재 123p)'
}
</script>

<template>
  <div class="practice-section">
    <h2>reactive 배열 감시 (Array)</h2>

    <h3>📋 할 일 목록 ({{ taskList.length }}개)</h3>
    <ul>
      <li v-for="t in taskList" :key="t.id">
        <span :style="{ textDecoration: t.done ? 'line-through' : 'none' }">{{ t.title }}</span>
      </li>
    </ul>
    <button @click="addTask">항목 추가 (push)</button> &nbsp;
    <button @click="toggleFirst">첫 항목 완료 토글</button> &nbsp;
    <button @click="removeLast">마지막 삭제 (splice)</button>

    <div class="monitor auto">
      <p>👁️‍🗨️ ① taskList 통째로 감시 (deep 자동)</p>
      <p>{{ logAutoDeep }}</p>
      <small>※ ref 배열과 달리 deep 옵션 없이도 잡힌다. 대신 이전 개수가 현재와 같게 찍힌다.</small>
    </div>

    <div class="monitor target">
      <p>🎯 ② () =&gt; taskList.length 조준</p>
      <p>{{ logLength }}</p>
      <small>※ 원시값을 뽑았으므로 과거가 보존된다.</small>
    </div>

    <div class="monitor warn">
      <p>⚠️ 재할당은 왜 안 되는가</p>
      <button @click="tryReassign">설명 보기</button>
      <p>{{ logBroken }}</p>
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
.monitor.warn {
  border-left-color: #e74c3c;
  background: rgba(231, 76, 60, 0.08);
}
.monitor small {
  opacity: 0.7;
}
</style>
