<!--
  ============================================================
  교재 156~168p | Props & Emits (자식)
  ============================================================
  [부모-자식은 철저히 독립적이다]
    자식은 부모의 반응형 변수를 함부로 가져다 쓸 수 없고,
    부모도 자식 내부 데이터에 함부로 접근할 수 없다.
    → 데이터를 주고받으려면 반드시 정해진 통로(props / emits)를 거쳐야 한다.

  ┌─────────────────────────────────────────────────────┐
  │  props :  부모 ──데이터──▶ 자식   (자식은 읽기 전용)   │
  │  emits :  자식 ──이벤트──▶ 부모   (값도 함께 전달 가능) │
  └─────────────────────────────────────────────────────┘

  ★ defineProps / defineEmits 는 **컴파일러 매크로**다
    · import 가 필요 없다 (빌드 시점에 Vue 컴파일러가 변환하는 예약어)
    · <script setup> 안에서만 쓸 수 있다

  ★★ 네이밍 규칙 — 가장 많이 틀리는 곳 ★★
      자식에서 선언: camelCase   →  parentData
      부모에서 호출: kebab-case  →  :parent-data="message"

    왜? HTML 템플릿은 **대소문자를 구분하지 않는다.**
    camelCase 로 쓰면 속성이 전부 소문자로 뭉개져서 전달된다.
    kebab-case 로 쓰면 Vue 가 알아서 camelCase 로 매핑해준다.
    (이벤트명도 같은 이유로 kebab-case: 'update-request')

  ▪ props 정의 2가지 방식
      배열형(간단):  defineProps(['title', 'count'])
      객체형(실무):  defineProps({ title: { type: String, required: true } })

      · type      데이터 타입 ([String, Number] 처럼 복수 허용도 가능)
      · required  부모가 반드시 넘겨야 함
      · default   안 넘겼을 때 기본값
                  ⚠️ 배열·객체·함수를 기본값으로 줄 땐 **화살표 함수로 감싸야** 한다
      · validator 커스텀 검증 함수 (범위 체크 등)

  ▪ props 사용
      template 안 : {{ parentData }}          그냥 이름으로
      script  안 : const props = defineProps(...) → props.parentData

  ▪ emits
      defineEmits(['이벤트명']) 은 **정의일 뿐**이다.
      실제 발생은 emit('이벤트명', 페이로드) 를 **호출하는 순간** 일어난다.
      두 번째 인자가 payload — 부모 핸들러의 파라미터로 그대로 전달된다.
-->
<script setup>
// 1. 상위 컴포넌트로부터 주입받을 데이터의 자료형 및 필수 여부 정의
//    (defineProps 는 import 없이 바로 쓴다 — 컴파일러 매크로)
const props = defineProps({
  parentData: {
    type: String,
    required: true,
  },
})

// 2. 상위 컴포넌트로 송신할 커스텀 이벤트 식별자 등록
const emit = defineEmits(['update-request'])

// 3. 내부 이벤트 발생 시 페이로드를 실어 상위로 이벤트를 디스패치하는 함수
const sendNotification = () => {
  const payload = 'Child에서 가공한 새로운 데이터'
  emit('update-request', payload)
}

// script 안에서 props 를 읽을 땐 props.xxx 로 접근한다 (template 과 다름)
const showPropsInScript = () => {
  console.log(`[Child] script 에서 읽은 props: "${props.parentData}"`)
}
</script>

<template>
  <div class="child-container">
    <h3>하위 컴포넌트 (Child)</h3>
    <p>
      <!-- template 에서는 props 이름을 그냥 쓴다 -->
      수신된 Props 데이터: <strong>{{ parentData }}</strong>
    </p>
    <p class="readonly-note">
      ※ props 는 <b>읽기 전용</b>이다. 자식이 parentData 를 직접 바꾸면 Vue 가 경고를 낸다.
    </p>
    <button @click="sendNotification">상위 컴포넌트로 갱신 요청 (Emit)</button>
    <button @click="showPropsInScript">script 에서 props 읽기 (콘솔)</button>
  </div>
</template>

<style scoped>
.child-container {
  margin-top: 12px;
  padding: 14px 16px;
  border: 1px dashed #6366f1;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.06);
}
.readonly-note {
  font-size: 0.8rem;
  opacity: 0.75;
  margin: 6px 0 10px;
}
</style>
