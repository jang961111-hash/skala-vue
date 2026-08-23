<!--
  ============================================================
  교재 106p | Form Data Binding - Two-way Data Binding with v-model
  ============================================================
  [핵심] v-model = HTML 입력 요소의 값 ↔ JS 데이터(ref)를 묶는 '양방향' 바인딩

    한쪽이 바뀌면 다른 한쪽도 실시간으로 똑같이 바뀐다.
      · HTML 입력 → JS 변수가 바뀜
      · JS 변수 변경 → HTML 입력창 값이 바뀜

  ★★ v-bind는 단방향, v-model은 양방향 (강사님 강조) ★★
      v-bind : JS가 바뀌면 template이 바뀐다. (한 방향)
      v-model: JS ↔ template 양쪽으로 왔다 갔다 한다.

  ★★ v-model의 정체 — 이 컴포넌트의 존재 이유 ★★
    v-model은 마법이 아니다. 내부적으로 **v-bind + v-on을 결합**한 것이다.

      <input v-model="text1" />
                    ↕ 완전히 동일한 동작
      <input :value="text2" @input="(e) => (text2 = e.target.value)" />

    아래 2번 예제를 뜯어보면:
      :value="text2"           → text2 값을 input의 value 속성에 꽂는다 (JS → 화면)
      @input="(e) => ..."      → 타이핑할 때마다 e.target.value를 text2에 넣는다 (화면 → JS)
    이 두 방향이 합쳐져서 '양방향'이 된다.

  [비유] v-model은 **자동문**이다. 안에서 밀어도 열리고 밖에서 당겨도 열린다.
         v-bind는 **한쪽으로만 열리는 문**. 아래 2번은 그 자동문을
         "센서(@input) + 모터(:value)"로 직접 조립해 본 것이다.

  [관찰 포인트] 1번과 2번을 각각 타이핑해 보면 결과가 완전히 똑같다.
                짧게 쓰려고 만든 게 v-model일 뿐이다.
-->
<script setup>
import { ref } from 'vue'

const text1 = ref('') // v-model용 변수
const text2 = ref('') // 원리 이해용 변수
</script>

<template>
  <div class="practice-section">
    <h2>v-model 양방향 데이터 바인딩</h2>

    <h3>1) v-model 축약 문법 (양방향)</h3>
    <input type="text" v-model="text1" placeholder="여기에 입력하세요" />
    <p>
      입력된 값: <strong>{{ text1 }}</strong>
    </p>

    <h3>2) v-model의 내부 작동 원리 (단방향 + 이벤트)</h3>
    <!--
      :value  = JS → 화면 (v-bind, 단방향)
      @input  = 화면 → JS (v-on + 이벤트 객체의 e.target.value)
      두 개를 합쳐야 비로소 양방향이 된다.
    -->
    <input
      type="text"
      :value="text2"
      placeholder="원리 파악용 입력창"
      @input="(e) => (text2 = e.target.value)"
    />
    <p>
      입력된 값: <strong>{{ text2 }}</strong>
    </p>
  </div>
</template>
