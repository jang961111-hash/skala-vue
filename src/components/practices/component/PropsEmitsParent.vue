<!--
  ============================================================
  교재 168p / Code Challenge 172p | Props & Emits (부모)
  ============================================================
  ★★ 데이터가 한 몸처럼 움직이는 이유 — 4단계 흐름 ★★

    ① 부모가 반응형 변수(message)를 자식에게 :parent-data 로 **props 전달**
    ② 자식이 버튼 클릭 → emit('update-request', payload) 호출
    ③ 부모가 @update-request="handleUpdateRequest" 로 수신
       → 핸들러가 payload 를 받아 **부모의 message 를 갱신**
    ④ message 는 반응형이므로 → 다시 렌더링 → ①의 props 도 같이 바뀜
       → 부모 화면과 자식 화면이 동기화된 것처럼 보인다

  [강사 조언] props 와 emits 를 한 번에 보면 헷갈린다. **따로 떼어서** 볼 것.
              자식 입장에서 순서대로:
                (a) 내가 뭘 받아야 하나? → props
                (b) 내가 뭘 내보내야 하나? → emits

  [실무] 컴포넌트 하나가 props 를 수십 개 정의하는 일은 흔하다(대부분 default).
         emits 는 상대적으로 적게 쓴다.
-->
<script setup>
import { ref } from 'vue'
import PropsEmitsChild from './PropsEmitsChild.vue'

// 1. 상위 컴포넌트의 로컬 반응형 상태 정의
const message = ref('Parent 초기 메시지')

// 2. 하위 컴포넌트의 커스텀 이벤트를 수신했을 때 실행될 핸들러 함수
//    인자(newValue)로 하위 컴포넌트가 보낸 페이로드가 자동 주입된다
const handleUpdateRequest = (newValue) => {
  message.value = newValue
  console.log(`[Parent] 자식이 보낸 payload 수신: "${newValue}"`)
}
</script>

<template>
  <div class="practice-section">
    <h2>Props &amp; Emits</h2>

    <div class="parent-container">
      <h3>상위 컴포넌트 (Parent)</h3>
      <p>
        현재 로컬 데이터(State): <strong>{{ message }}</strong>
      </p>
      <button @click="message = 'Parent 초기 메시지'">부모 상태 되돌리기</button>

      <!-- 선언은 camelCase(parentData), 호출은 kebab-case(:parent-data)
           이벤트명도 kebab-case(@update-request) -->
      <PropsEmitsChild :parent-data="message" @update-request="handleUpdateRequest" />
    </div>

    <p class="hint">
      ※ 자식의 [Emit] 버튼을 누르면 부모 상태가 바뀌고, 그 값이 다시 자식에게 props 로 내려가 두
      화면이 동시에 갱신됩니다.
    </p>
  </div>
</template>

<style scoped>
.parent-container {
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}
.hint {
  margin-top: 12px;
  font-size: 0.8rem;
  opacity: 0.65;
}
</style>
