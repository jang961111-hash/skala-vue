<!--
  ============================================================
  교재 199~211p | Pinia Store — Code Challenge 211p
  ============================================================
  [왜 스토어가 필요한가]
    props / emits 는 **부모-자식** 사이에서만 통한다.
    형제끼리도, 라우터로 갈린 페이지끼리도 못 쓴다.
    provide/inject 는 조상-후손만 가능하고 추적이 어렵다.
    → 어디서든 접근 가능한 **전역 저장소**가 스토어다.

  ────────────────────────────────────────────────────────
  Pinia 구축 3단계 (교재 202~204p)
  ────────────────────────────────────────────────────────
    Step 1  main.js 에서 createPinia() 생성 후 app.use() 로 등록
    Step 2  stores/스토어명.js 에서 defineStore() 로 생성
            식별자 규칙: use + 파일명 + Store  →  useCounterStore
    Step 3  컴포넌트에서 import → 인스턴스 가동 → state/getter/action 사용

  ────────────────────────────────────────────────────────
  스토어 3요소는 Vue 문법 그대로다 (교재 203p)
  ────────────────────────────────────────────────────────
    | 코드          | Vue 스펙   | Pinia 명칭 |
    |--------------|-----------|-----------|
    | count        | ref()     | state     |
    | doubleCount  | computed()| getters   |
    | increment()  | 일반 함수  | actions   |
    | return {...} | 객체 반환  | Expose    |

    → 새 문법을 배우는 게 아니라, **이미 아는 것을 파일 하나로 옮긴 것**이다.

  ★★ 교재 205p Frequent Mistakes — 이 실습의 핵심 ★★

      const { count } = counterStore              ❌ 반응성 단절
      const { count } = storeToRefs(counterStore) 🟢 반응성 보존
      const { increment } = counterStore          🟢 함수는 그냥 분해해도 됨

    구조분해할당은 값을 **꺼내서 복사**한다. 그 순간 Proxy 연결이 끊긴다.
    storeToRefs 는 각 속성을 ref 로 감싸서 꺼내므로 연결이 유지된다.
    (Actions 는 함수 자체를 참조하는 것이라 끊길 게 없다)

  [비유] 스토어는 **은행 계좌**다.
         storeToRefs 는 **통장** — 잔액이 바뀌면 통장에도 반영된다.
         일반 구조분해는 **현금 인출** — 뽑는 순간 계좌와 무관해진다.

  [실습 순서]
    ① '숫자 1 증가' 를 눌러보세요.
       · state / getters / storeToRefs 값은 전부 올라간다
       · ❌ 구조분해 값만 **0에 멈춰 있다**
    ② Vue Devtools(Option+Shift+D) → Pinia 탭에서 counter 스토어 확인
  ============================================================
-->
<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter.js'

// Step 3-①②: import 후 인스턴스 가동 (전역 저장소 포인터 확보)
const counterStore = useCounterStore()

// 🟢 데이터(state/getters)는 storeToRefs 로 꺼내야 반응성이 유지된다
const { count, doubleCount } = storeToRefs(counterStore)

// 🟢 액션(함수)은 그냥 분해해도 무방하다
const { increment } = counterStore

// ❌ 잘못된 방법 — 이 값은 최초 시점에 복사된 뒤 다시는 안 바뀐다
const { count: brokenCount } = counterStore
</script>

<template>
  <div class="practice-section">
    <h2>Counter Store 활용 실습</h2>

    <p>
      원본 카운트 데이터(state): <strong>{{ counterStore.count }}</strong>
    </p>
    <p>
      2배 연산 데이터(getters): <span>{{ counterStore.doubleCount }}</span>
    </p>
    <button @click="counterStore.increment">숫자 1 증가 (actions)</button>

    <hr class="sep" />

    <h3>구조분해할당 비교 (교재 205p)</h3>
    <div class="compare">
      <div class="ok">
        <p class="tag">🟢 storeToRefs 로 분해</p>
        <p>
          count: <strong>{{ count }}</strong> / doubleCount: <strong>{{ doubleCount }}</strong>
        </p>
        <button @click="increment">분해한 action 으로 증가</button>
      </div>

      <div class="bad">
        <p class="tag">❌ 그냥 구조분해</p>
        <p>
          count: <strong>{{ brokenCount }}</strong>
        </p>
        <small>버튼을 아무리 눌러도 이 값은 안 바뀝니다. Proxy 연결이 끊겼기 때문입니다.</small>
      </div>
    </div>

    <p class="hint">
      ※ Vue Devtools 를 열고(Option+Shift+D) <b>Pinia</b> 탭에서 counter 스토어의 state 가
      실시간으로 바뀌는 것을 확인하세요.
    </p>
  </div>
</template>

<style scoped>
.sep {
  margin: 18px 0 14px;
  border: 0;
  border-top: 1px solid var(--color-border);
}
.compare {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}
.ok,
.bad {
  padding: 12px 15px;
  border: 1px solid var(--color-border);
  border-left-width: 3px;
  border-radius: 8px;
}
.ok {
  border-left-color: #42b883;
  background: rgba(66, 184, 131, 0.07);
}
.bad {
  border-left-color: #e74c3c;
  background: rgba(231, 76, 60, 0.07);
}
.tag {
  font-weight: 700;
  font-size: 0.88rem;
  margin-bottom: 6px;
}
.bad small {
  display: block;
  margin-top: 6px;
  opacity: 0.75;
}
.hint {
  margin-top: 14px;
  font-size: 0.8rem;
  opacity: 0.65;
}
</style>
