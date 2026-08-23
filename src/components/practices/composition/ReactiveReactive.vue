<!--
  ============================================================
  교재 123~124p | Reactive State - reactive()
  ============================================================
  [핵심] reactive()는 **참조 자료형만** 반응형으로 만든다.
         (객체·배열·Map·Set — 숫자나 문자열은 못 감싼다)

    · <script setup> 에서도 .value 없이 접근  ← ref()와 가장 큰 차이
    · <template>     에서도 일반 객체처럼 사용

  ★★ reactive()의 치명적 약점 — 반응성 단절 ★★

      let state = reactive({ count: 0 })

      state = { count: 5 }    // ❌ 통째로 갈아끼우면 연결이 끊긴다
      state.count = 5         // 🟢 내부 속성만 바꿔야 한다

  배열도 마찬가지다. `items = ['a','b']` 로 재할당하면 죽는다.
  → push / splice 로 조작하거나, 애초에 ref()를 쓴다.

  [비유] ref는 **택배 상자**다. 상자째 바꿔도 송장(발신기)은 그대로 붙어 있다.
         reactive는 **방에 붙인 감시 카메라**다. 방 안 물건을 옮기면 잡히지만,
         방 자체를 다른 방으로 바꿔버리면 카메라는 옛날 방만 계속 본다.

  [실무] 이 약점 때문에 현업에서는 객체·배열도 그냥 ref()로 통일하는 추세다.
         (교재 123p 명시) 그래도 reactive를 알아야 하는 이유는,
         남의 코드에서 만나면 이 함정을 알아봐야 하기 때문이다.
-->
<script setup>
import { reactive } from 'vue'

const userReactive = reactive({ name: '이순신', age: 30 })
const celebrateReactive = () => {
  // .value 가 없다 — reactive 는 바로 속성에 접근한다
  userReactive.age++
}

const items = reactive(['사과', '바나나'])
const addItem = () => {
  // 재할당(items = [...])이 아니라 push 로 조작해야 반응성이 유지된다
  items.push(`과일 ${items.length + 1}`)
}
const removeItem = (index) => {
  items.splice(index, 1)
}
</script>

<template>
  <div class="practice-section">
    <h2>반응형 상태 reactive() 특징 및 주의점</h2>

    <h3>1) 객체(Object) reactive</h3>
    <p>이름: {{ userReactive.name }} / 나이: {{ userReactive.age }}세</p>
    <button @click="celebrateReactive">reactive 나이 한 살 추가</button>

    <h3>2) 배열(Array) reactive</h3>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        {{ item }}
        <button @click="removeItem(index)" style="margin-left: 8px; padding: 2px 6px">삭제</button>
      </li>
    </ul>
    <button @click="addItem">과일 항목 추가</button>
  </div>
</template>
