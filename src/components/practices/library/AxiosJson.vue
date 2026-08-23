<!--
  ============================================================
  교재 228~229p | Axios JSON Example — REST API CRUD
  ============================================================
  JSONPlaceholder(무료 테스트 API)로 GET/POST/PUT/DELETE 를 전부 쳐본다.
  ★ API 키가 필요 없으므로 바로 실행된다.

  ▸ HTTP 메서드와 의미 (교재 214p)
      GET     조회      서버 상태를 바꾸지 않는다
      POST    생성      새 자원을 만든다
      PUT     전체수정   자원을 통째로 바꾼다
      PATCH   부분수정   일부 필드만 바꾼다
      DELETE  삭제

    ※ 교수님 강의: "백엔드에서 API 를 만들어 주는 것이라
      프론트엔드에는 선택권이 없다. 백엔드가 이렇게 쓰라면 그렇게 쓴다."

  ▸ 왜 fetch 가 아니라 Axios 인가 (교재 222p)
      fetch  : 응답을 .json() 으로 한 번 더 변환해야 한다
               4xx/5xx 를 에러로 안 본다 (직접 status 체크 필요)
      Axios  : response.data 가 이미 JSON 객체다
               4xx/5xx 를 자동으로 reject → catch 로 떨어진다
      → 코딩량이 줄어든다.

  ▸ 비동기 처리 (교재 227p)
      async 함수 + await 호출
      try   : 성공 경로
      catch : 4xx/5xx, 네트워크 오프라인
      finally : 성공·실패 상관없이 마무리 (로딩 해제 등)

  ⚠️ JSONPlaceholder 는 **가짜(fake) API** 다.
     POST/PUT/DELETE 가 200 을 돌려주지만 서버에 실제로 저장되지는 않는다.
     응답은 정상적으로 오므로 통신 흐름을 익히는 데는 충분하다.
     → 그래서 화면 목록은 응답을 받아 **직접** 갱신해 준다.

  [실습 순서] F12 콘솔을 열고 버튼을 하나씩 눌러보세요.
-->
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 💡 1. 백엔드 공용 주소
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

// 💡 2. 반응형 상태 데이터
const items = ref([]) // 서버에서 받아온 데이터 배열 박스
const textInput = ref('') // 입력창과 연결된 글자 데이터 박스
const isLoading = ref(false)
const logs = ref([])

const addLog = (msg) => {
  logs.value.unshift(`${new Date().toLocaleTimeString('ko-KR')}  ${msg}`)
  logs.value = logs.value.slice(0, 6)
}

// ─────────────────────────────────────────────
// [READ] GET : 데이터 가져오기
// ─────────────────────────────────────────────
const handleRead = async () => {
  isLoading.value = true
  try {
    // 공부용으로 딱 3개만 들고 옵니다. params 는 ?_limit=3 으로 붙는다.
    const response = await axios.get(BASE_URL, { params: { _limit: 3 } })
    items.value = response.data
    console.log('GET 성공:', response.data)
    addLog(`GET 성공 — ${response.data.length}건 수신 (status ${response.status})`)
  } catch (error) {
    console.error('GET 실패:', error)
    addLog(`GET 실패 — ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

// ─────────────────────────────────────────────
// [CREATE] POST : 새로 만들기
// ─────────────────────────────────────────────
const handleCreate = async () => {
  if (!textInput.value.trim()) return
  try {
    const response = await axios.post(BASE_URL, {
      title: textInput.value,
      body: '실습용 본문',
      userId: 1,
    })
    // 가짜 API 라 실제 저장은 안 되므로 화면 목록에 직접 얹어 준다
    items.value.unshift(response.data)
    addLog(`POST 성공 — id ${response.data.id} 생성 (status ${response.status})`)
    textInput.value = ''
  } catch (error) {
    addLog(`POST 실패 — ${error.message}`)
  }
}

// ─────────────────────────────────────────────
// [UPDATE] PUT : 통째로 수정
// ─────────────────────────────────────────────
const handleUpdate = async (item) => {
  try {
    const response = await axios.put(`${BASE_URL}/${item.id}`, {
      ...item,
      title: `${item.title} (수정됨)`,
    })
    const idx = items.value.findIndex((i) => i.id === item.id)
    if (idx !== -1) items.value[idx] = response.data
    addLog(`PUT 성공 — id ${item.id} 수정 (status ${response.status})`)
  } catch (error) {
    addLog(`PUT 실패 — ${error.message}`)
  }
}

// ─────────────────────────────────────────────
// [DELETE] DELETE : 삭제
// ─────────────────────────────────────────────
const handleDelete = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`)
    items.value = items.value.filter((i) => i.id !== id)
    addLog(`DELETE 성공 — id ${id} 삭제 (status ${response.status})`)
  } catch (error) {
    addLog(`DELETE 실패 — ${error.message}`)
  }
}

// ─────────────────────────────────────────────
// [에러 처리 확인] 일부러 없는 주소를 호출한다
// ─────────────────────────────────────────────
const handleError = async () => {
  try {
    await axios.get('https://jsonplaceholder.typicode.com/no-such-endpoint/99999')
  } catch (error) {
    // Axios 는 4xx/5xx 를 자동으로 reject 한다 → 여기로 온다
    addLog(`의도된 실패 — status ${error.response?.status ?? '(응답없음)'} : ${error.message}`)
    console.error('의도적으로 발생시킨 에러:', error)
  }
}

// 교재 153p — Mounting 이 API 호출 최적 타이밍
onMounted(handleRead)
</script>

<template>
  <div class="practice-section">
    <h2>Axios JSON Example (REST API CRUD)</h2>
    <p class="target">
      대상: <code>jsonplaceholder.typicode.com/posts</code> — 키 불필요한 무료 테스트 API
    </p>

    <div class="toolbar">
      <input
        v-model="textInput"
        placeholder="새 글 제목을 입력하세요"
        @keyup.enter="handleCreate"
      />
      <button :disabled="!textInput.trim()" @click="handleCreate">POST 생성</button>
      <button :disabled="isLoading" @click="handleRead">
        {{ isLoading ? 'GET 중…' : 'GET 다시 조회' }}
      </button>
      <button class="warn" @click="handleError">에러 처리 확인 (404)</button>
    </div>

    <ul class="items">
      <li v-for="item in items" :key="item.id">
        <span class="id">#{{ item.id }}</span>
        <span class="title">{{ item.title }}</span>
        <button @click="handleUpdate(item)">PUT</button>
        <button class="danger" @click="handleDelete(item.id)">DELETE</button>
      </li>
      <li v-if="!items.length && !isLoading" class="empty">데이터가 없습니다.</li>
    </ul>

    <div class="log">
      <p class="log-title">통신 로그</p>
      <p v-for="(l, i) in logs" :key="i" class="log-line">{{ l }}</p>
      <p v-if="!logs.length" class="log-line dim">아직 로그가 없습니다.</p>
    </div>

    <p class="hint">
      ⚠️ JSONPlaceholder 는 가짜 API 라 POST/PUT/DELETE 가 200 을 주지만 실제로 저장되지 않습니다.
      응답은 정상이므로 통신 흐름을 익히는 데는 충분합니다.
    </p>
  </div>
</template>

<style scoped>
.target {
  font-size: 0.82rem;
  opacity: 0.7;
  margin-bottom: 12px;
}
.toolbar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.toolbar input {
  flex: 1 1 200px;
}
.toolbar button.warn {
  border-color: #f39c12;
  color: #b8730f;
}
.items {
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.items li {
  display: grid;
  grid-template-columns: 44px 1fr auto auto;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.86rem;
}
.items li.empty {
  display: block;
  text-align: center;
  opacity: 0.6;
}
.id {
  font-size: 0.75rem;
  opacity: 0.6;
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.items button {
  padding: 3px 9px;
  font-size: 0.72rem;
}
.items button.danger {
  border-color: #e74c3c;
  color: #c0392b;
}
.log {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: rgba(127, 127, 127, 0.06);
}
.log-title {
  font-size: 0.76rem;
  font-weight: 700;
  opacity: 0.7;
  margin-bottom: 5px;
}
.log-line {
  font-family: ui-monospace, monospace;
  font-size: 0.74rem;
  line-height: 1.7;
}
.log-line.dim {
  opacity: 0.5;
}
.hint {
  margin-top: 12px;
  font-size: 0.78rem;
  opacity: 0.65;
}
</style>
