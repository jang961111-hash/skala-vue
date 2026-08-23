<!--
  ============================================================
  교재 152~154p | Component Lifecycle Hook (자식)
  ============================================================
  [4단계 라이프사이클]

    Creation  (생성)  — 컴포넌트가 메모리에 만들어짐. **DOM 접근 불가**
                       <script setup> 본문 자체가 이 단계다 (별도 훅 없음)
    Mounting  (부착)  — 가상으로 만든 화면을 실제 브라우저에 붙임
                       → ★ 백엔드 API 호출로 초기 데이터 가져오기 최적 타이밍
    Updating  (갱신)  — 반응형 데이터가 바뀌어 템플릿을 다시 그림
    Unmounting(탈착)  — 화면에서 사라짐
                       → ★ 자원 정리 (타이머 clear, 이벤트 리스너 해제)

  [왜 화면 뼈대가 먼저 뜨고 데이터가 나중에 채워지는가]
    API 호출을 onMounted 에서 하기 때문이다. 화면을 먼저 붙이고
    비동기로 데이터를 받아 채운다. 실무 로딩 스피너가 이 구간이다.

  ★★ onUnmounted 를 빼먹으면 생기는 일 ★★
    setInterval 을 걸어두고 정리하지 않으면, 컴포넌트가 사라져도
    타이머는 **백그라운드에서 영원히 돈다**. → 메모리 누수.
    이 실습에서 부모의 토글로 직접 확인할 수 있다.

  [비유] 방을 빌렸다가 나갈 때 **가스 밸브를 잠그는 것**이 onUnmounted 다.
         안 잠그고 나가면 방은 비었는데 가스는 계속 샌다.

  [실습 순서 — F12 콘솔을 열고 하세요]
    1. 부모에서 '자식 표시' → 1.setup → 2.onMounted 순서로 로그
    2. 3초마다 count 증가 → 3.onUpdated 반복 출력
    3. '자식 숨기기' → 4.onUnmounted + 타이머 청소
       (숨긴 뒤 onUpdated 로그가 멈추는지 확인)
-->
<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const count = ref(0)
let timerId = null // 실시간 타이머 메모리 주소를 담을 변수

// 생성 (Creation) 단계 = <script setup> 본문 그 자체
console.log('1. [setup] 컴포넌트가 메모리에 생성되었습니다. (DOM 접근 불가능)')

// 부착 (Mounting) 단계
onMounted(() => {
  console.log('2. [onMounted] 화면에 완벽히 부착되었습니다! (API 호출/DOM 조작 적기)')
  // 🔥 실무 활용 시뮬레이션: 3초마다 숫자가 자동으로 올라가는 타이머 가동
  timerId = setInterval(() => {
    count.value++
  }, 3000)
})

// 갱신 (Updating) 단계 - count 가 바뀌어 화면이 리렌더링될 때마다 매번 실행
onUpdated(() => {
  console.log(
    `3. [onUpdated] 데이터가 변경되어 화면을 새로 그렸습니다. (현재 count: ${count.value})`,
  )
})

// 소멸 (Unmounting) 단계 - v-if="false" 등으로 완전히 파괴될 때 실행
onUnmounted(() => {
  // ❌ 여기서 타이머를 안 꺼주면 컴포넌트가 사라져도 백그라운드에서 영원히 돈다 (메모리 누수)
  clearInterval(timerId)
  console.log('4. [onUnmounted] 컴포넌트가 소멸했습니다. 타이머 청소 완료!')
})
</script>

<template>
  <div class="child-box">
    <h3>🔄 라이프사이클 자식 컴포넌트</h3>
    <p>
      3초마다 자동 증가하는 count: <strong>{{ count }}</strong>
    </p>
    <button @click="count++">수동으로 count 증가 (onUpdated 확인)</button>
  </div>
</template>

<style scoped>
.child-box {
  margin-top: 12px;
  padding: 14px 16px;
  border: 1px solid #42b883;
  border-radius: 8px;
  background: rgba(66, 184, 131, 0.06);
}
</style>
