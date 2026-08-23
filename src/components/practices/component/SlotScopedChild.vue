<!--
  ============================================================
  교재 176p | Scoped Slot — 자식 (셋 중 가장 어려움)
  ============================================================
  ★★ 방향이 반대다 ★★
    Default / Named Slot : 부모 ──마크업──▶ 자식
    Scoped Slot          : 자식 ──데이터──▶ 부모  (역방향!)

  자식이 "내가 가진 데이터를 줄 테니, 이걸로 마크업을 만들어 줘"
  라고 부모에게 넘기는 것이다.

  ▸ 자식 쪽 문법
      <slot :text="message" :count="userCount"></slot>
                ↑ props 전달과 똑같이 생겼지만 **방향이 자식→부모**다

  [왜 필요한가]
    리스트·테이블 컴포넌트를 생각해 보자.
    자식은 데이터를 갖고 반복을 돌리지만, **각 행을 어떻게 그릴지**는
    쓰는 쪽(부모)마다 다르다. 그래서 데이터만 넘기고 마크업은 부모가 정한다.

  [비유] 자식이 **재료를 담은 장바구니**를 부모에게 건네며
         "요리는 네가 알아서 해" 하는 것. 재료는 자식 것, 요리법은 부모 것.
-->
<script setup>
import { ref } from 'vue'

// 하위 컴포넌트 내부에서 관리하는 2개의 서로 다른 기본형 데이터
const message = ref('현재 서버 상태 정상')
const userCount = ref(150)

const refresh = () => {
  userCount.value = Math.floor(Math.random() * 300) + 1
  message.value = userCount.value > 200 ? '접속자 급증 — 주의' : '현재 서버 상태 정상'
}
</script>

<template>
  <div class="base-card">
    <h3>하위 컴포넌트 (Child)</h3>
    <!-- 자식이 가진 데이터를 slot 에 실어 부모에게 올려보낸다 -->
    <slot :text="message" :count="userCount">
      <p>부모가 마크업을 주입하지 않았을 때의 디폴트 화면</p>
    </slot>
    <button @click="refresh">자식 데이터 갱신</button>
  </div>
</template>

<style scoped>
.base-card {
  margin: 8px 0;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: rgba(6, 182, 212, 0.06);
}
</style>
