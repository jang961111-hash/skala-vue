<!--
  ================================================================
  교재 195p 요구사항 1 | NotFoundView.vue  (Catch-all Route)
  ================================================================
  ▸ 라우트가 안 맞으면 무슨 일이 일어나나
      Vue Router 는 **에러를 던지지 않는다.** 그냥 매칭되는 컴포넌트를
      못 찾을 뿐이다. 그 결과 <RouterView/> 자리에 아무것도 안 그려져
      **화면이 하얗게 비어 보인다.** 사용자는 앱이 죽은 줄 안다.

  ▸ 해결 — Catch-all Route
      path: '/:pathMatch(.*)*'
             └ 동적 세그먼트 + 정규식(.*) + 반복(*)
      "위에서 아무것도 안 걸린 나머지 전부"를 잡는다.

  ⚠️ 반드시 라우트 목록의 **가장 마지막**에 둬야 한다.
     위에 두면 이게 먼저 걸려서 다른 라우트가 영원히 실행되지 않는다.
  ================================================================
-->
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <main class="notfound">
    <p class="code">404</p>
    <h2>페이지를 찾을 수 없습니다</h2>
    <p class="path">
      요청한 경로: <code>{{ route.fullPath }}</code>
    </p>
    <p class="hint">
      Catch-all Route(<code>/:pathMatch(.*)*</code>)가 잡아낸 화면입니다. 이게 없었다면 빈 화면만
      보였을 것입니다.
    </p>
    <div class="actions">
      <button type="button" @click="router.push('/')">대시보드로</button>
      <button type="button" class="ghost" @click="router.back()">이전 페이지로</button>
    </div>
  </main>
</template>

<style scoped>
.notfound {
  max-width: 520px;
  margin: 0 auto;
  padding: 70px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  line-height: 1.6;
}
.code {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.notfound h2 {
  font-size: 1.25rem;
  font-weight: 700;
}
.path,
.hint {
  font-size: 0.85rem;
  opacity: 0.75;
}
code {
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(127, 127, 127, 0.15);
  font-size: 0.9em;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.actions button {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid #6366f1;
  background: #6366f1;
  color: #fff;
  cursor: pointer;
}
.actions button.ghost {
  background: transparent;
  color: #6366f1;
}
</style>
