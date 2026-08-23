<!--
  ============================================================
  교재 121~122p | Reactive State - ref()
  ============================================================
  [핵심] ref()는 원시 타입(숫자·문자·불리언)이든 참조 타입(배열·객체)이든
         무엇이든 감싸서 반응형으로 만든다.

    · <script setup> 에서는  .value 로 접근
    · <template>     에서는  .value 없이 그냥 사용 (Vue가 자동으로 벗겨줌)

  [비유] ref()는 물건에 붙이는 **발신기**다. 숫자든 상자든 뭐든 붙일 수 있고,
         내용물이 바뀌면 Vue에게 신호가 간다.
         다만 코드에서 직접 열어볼 땐 발신기 껍데기(.value)를 벗겨야 한다.

  [관찰 포인트]
    · '과일 추가' → 배열을 ref로 감싸도 push 가 반응한다
    · '사용자 이름 변경' → 객체 속성 하나만 바꿔도 화면이 갱신된다
      (script 안에서는 user.value.name 처럼 .value 를 거쳐야 한다)
-->
<script setup>
import { ref } from 'vue'

const count = ref(0)
const name = ref('홍길동')
const isActive = ref(true)
const items = ref(['사과', '배'])
const user = ref({ name: '이순신', age: 30 })

const increaseRef = () => {
  count.value++
}
const changeUserName = () => {
  // script 안에서는 .value 를 거쳐 내부 속성에 접근한다
  user.value.name = '장보고'
}
</script>

<template>
  <div class="practice-section">
    <h2>반응형 상태 ref() 기초</h2>
    <p>
      Ref 카운트: <strong>{{ count }}</strong>
    </p>
    <p>이름: <input v-model="name" />{{ name }}</p>
    <p>활성 상태: {{ isActive ? '활성' : '비활성' }}</p>
    <p>과일 목록: {{ items.join(', ') }}</p>
    <p>사용자 정보: 이름 - {{ user.name }}, 나이 - {{ user.age }}</p>
    <button @click="increaseRef">Ref 변수 증가</button>
    <button @click="isActive = !isActive">토글</button>
    <!-- template 안에서는 .value 없이 배열 메서드를 바로 쓴다 -->
    <button @click="items.push('귤')">과일 추가</button>
    <button @click="changeUserName">사용자 이름 변경</button>
  </div>
</template>
