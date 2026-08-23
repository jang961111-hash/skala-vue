<!--
  ============================================================
  교재 110~112p | Form Data Binding - v-model Modifiers
  ============================================================
  [핵심] v-model 수식어도 이벤트 수식어와 똑같이 '문법 설탕(Syntactic Sugar)'이다.
         입력 요소의 동작 방식이나 수집되는 데이터 형태를 손쉽게 제어한다.

  ┌──────────┬────────────────────┬──────────────────────────┬────────────────────────┐
  │ 수식어    │ 기본 동작 이벤트     │ 적용 후 동작               │ 목적                   │
  ├──────────┼────────────────────┼──────────────────────────┼────────────────────────┤
  │ .lazy    │ @input 타이핑마다   │ @change 포커스아웃/Enter  │ 불필요한 실시간 갱신·   │
  │          │                    │                          │ API 요청 방지          │
  │ .number  │ String으로 수집     │ Number로 자동 형변환      │ 숫자 입력 타입 변환     │
  │ .trim    │ 입력값 그대로       │ 양끝 공백 제거 후 수집     │ Validation 오류 예방    │
  └──────────┴────────────────────┴──────────────────────────┴────────────────────────┘

  ▪ .lazy — "게으르게, 뒤로 미루기" (강사님 어원 설명)
      lazy는 '게으르다'보다 **'뒤로 미룬다'**는 뜻으로 이해하는 게 맞다.
      지금 하면 힘드니까 나중에 몰아서 한다.
      (lazy loading 등 프로그래밍 전반에서 같은 의미로 쓰인다)
      → v-model의 기본 이벤트를 @input에서 @change로 '지연'시킨다.

  ▪ .trim — 실무에서 가장 많이 쓴다
      사용자가 복붙하다 앞뒤에 공백을 넣는 일이 정말 많다.
      ★ 중간 공백은 안 자른다. 양끝만 자른다. ★
      실무에서는 한 번만 자르지 않는다:
        폼 입력(v-model.trim) → API 호출 직전 → 백엔드 → DB
      네 군데서 다 자른다. 앞에서 잘라 왔을 거라고 믿지 않는다. (강사님)

  ▪ Modifier Chaining
      v-model.trim.number 처럼 필요한 만큼 이어 붙일 수 있다.
      이벤트 수식어(@click.stop.prevent)와 완전히 같은 방식이다.

  [실습 순서 — 이렇게 해봐야 차이가 보인다]
    1) .lazy 칸에 타이핑 → 아래 값이 안 바뀐다!
       칸 밖을 클릭하거나 Enter → 그제서야 반영된다.
    2) .number 칸에 13 입력 → 데이터 타입이 `string`이 아니라 `number`로 나온다.
    3) .trim 칸에 "  abc  " 처럼 앞뒤 공백 포함 입력
       → 공백이 잘려 길이가 3으로 나온다. (수식어 없으면 7)
    4) chaining 칸에 "  42  " 입력 → 공백 제거 + 숫자 변환이 동시에 일어난다.
-->
<script setup>
import { ref } from 'vue'

// v-model Modifiers 실습용 reactive 변수 선언
const lazyText = ref('')
const age = ref('')
const userEmail = ref('')
const price = ref('')
</script>

<template>
  <div class="practice-section">
    <h2>v-model 수식어 (Modifiers) 활용</h2>

    <!-- 1) .lazy 수식어 실습 -->
    <section style="margin-bottom: 20px">
      <h3>1) .lazy 수식어 (change 이벤트 시점 반영)</h3>
      <input type="text" v-model.lazy="lazyText" placeholder="입력 후 Enter 또는 외부 클릭" />
      <p>
        실시간이 아닌 확정된 값: <strong>{{ lazyText }}</strong>
      </p>
    </section>

    <!-- 2) .number 수식어 실습 -->
    <section style="margin-bottom: 20px">
      <h3>2) .number 수식어 (Number 타입 자동 형변환)</h3>
      <!-- type="text"인데도 .number가 붙으면 숫자로 변환된다 -->
      <input type="text" v-model.number="age" placeholder="나이를 입력하세요" />
      <p>
        입력된 값: <strong>{{ age }}</strong>
      </p>
      <p>
        데이터 타입: <strong>{{ typeof age }}</strong>
      </p>
    </section>

    <!-- 3) .trim 수식어 실습 -->
    <section style="margin-bottom: 20px">
      <h3>3) .trim 수식어 (양끝 공백 자동 제거)</h3>
      <input type="text" v-model.trim="userEmail" placeholder="앞뒤 공백을 포함해 입력해 보세요" />
      <p>
        공백 제거된 값: <strong>"{{ userEmail }}"</strong>
      </p>
      <!-- 눈으로는 공백이 안 보이니 길이로 확인하는 게 확실하다 -->
      <p>
        문자열 길이: <strong>{{ userEmail.length }}</strong>
      </p>
    </section>

    <!-- 4) 수식어 체이닝 (Chaining) 실습 -->
    <section>
      <h3>4) Chaining (수식어 체이닝: .trim.number)</h3>
      <input
        type="text"
        v-model.trim.number="price"
        placeholder="공백과 숫자를 섞어 입력해 보세요"
      />
      <p>
        처리된 값: <strong>"{{ price }}"</strong>
      </p>
      <p>
        데이터 타입: <strong>{{ typeof price }}</strong>
      </p>
    </section>
  </div>
</template>
