<!--
  ============================================================
  교재 107~109p | Form Data Binding - HTML Form 요소별 v-model 매핑
  ============================================================
  [핵심] v-model을 걸 때 **ref의 초기값 타입**을 폼 요소의 성격에 맞춰야 한다.
         안 맞추면 예외나 의도치 않은 버그가 난다. (교재 107p)

  ┌──────────────────────────┬──────────────────┬────────────────────────────┐
  │ Form 태그                 │ ref 초기값 타입    │ v-model이 담아주는 값        │
  ├──────────────────────────┼──────────────────┼────────────────────────────┤
  │ textarea (장문)           │ ref('')  문자열   │ 줄바꿈 포함 텍스트           │
  │ checkbox (단일)           │ ref(false) 불리언 │ 체크 true / 해제 false      │
  │ checkbox (다중)           │ ref([])  배열     │ 체크된 항목의 value가 쌓임   │
  │ radio (단일선택)          │ ref('')  문자열   │ 최종 선택한 하나의 value    │
  │ select (드롭다운)         │ ref('')  문자열   │ 선택한 option의 value       │
  └──────────────────────────┴──────────────────┴────────────────────────────┘

  [왜 타입이 다른가 — 생각해 보면 당연하다]
    · 체크박스 하나 → 켰나 껐나 두 상태뿐 → 불리언
    · 체크박스 여러 개 → "사과, 딸기" 여러 개를 담아야 함 → 배열
    · 라디오 → 여러 개 중 딱 하나만 선택됨 → 문자열 하나
    · 셀렉트 → 드롭다운도 하나만 선택 → 문자열 하나
      (멀티 셀렉트라면 배열이 된다)

  ★★ 내부 이벤트의 차이 (교재 107p 하단) ★★
    v-model은 v-bind + v-on의 결합인데, 그 v-on이 **어떤 이벤트**냐가 다르다.
      · input, textarea      → @input  (타이핑할 때마다 즉시 반영)
      · checkbox, radio, select → @change (값이 확정되는 시점에 반영)
    → 이게 바로 다음 실습 `.lazy` 수식어를 이해하는 열쇠다.

  [비유] 검색창에 글자를 칠 때마다 자동완성이 뜨는 건 @input,
         입력을 다 하고 칸을 빠져나올 때 반응하는 건 @change.

  [주의] 다중 체크박스에서 `value="사과"` 를 빼먹으면 배열에 무엇이 담길지
         알 수 없다. 다중 체크박스는 value 속성이 필수다.
-->
<script setup>
import { ref } from 'vue'

const comment = ref('')
const isAgreed = ref(false) // 단일 체크박스는 Boolean
const favoriteFruits = ref([]) // 다중 체크박스는 반드시 배열([])로 시작!
const gender = ref('')
const selectedCar = ref('')
</script>

<template>
  <div class="practice-section">
    <h2>모든 HTML Form 요소와 v-model 매핑</h2>

    <div>
      <h3>1) Textarea (장문 텍스트)</h3>
      <textarea v-model="comment" placeholder="의견을 남겨주세요"></textarea>
      <p>
        데이터 상태: <span>{{ comment }}</span>
      </p>
    </div>

    <div>
      <h3>2) 단일 Checkbox (동의 여부)</h3>
      <!-- label로 감싸면 글자를 눌러도 체크된다 (HTML 기본 동작) -->
      <label> <input type="checkbox" v-model="isAgreed" /> 약관에 동의합니다. </label>
      <p>
        데이터 상태: <span>{{ isAgreed }}</span>
      </p>
    </div>

    <div>
      <h3>3) 다중 Checkbox (복수 선택 -&gt; 배열에 저장)</h3>
      <!-- 세 개가 같은 변수(favoriteFruits)를 v-model로 공유한다. value가 배열에 쌓인다 -->
      <label><input type="checkbox" value="사과" v-model="favoriteFruits" /> 사과</label> &nbsp;
      <label><input type="checkbox" value="바나나" v-model="favoriteFruits" /> 바나나</label> &nbsp;
      <label><input type="checkbox" value="딸기" v-model="favoriteFruits" /> 딸기</label>
      <p>
        데이터 상태 (배열): <span>{{ favoriteFruits }}</span>
      </p>
    </div>

    <div>
      <h3>4) Radio (단일 선택)</h3>
      <!-- 같은 변수를 v-model로 공유하면 자동으로 한 그룹이 되어 하나만 선택된다 -->
      <label><input type="radio" value="남성" v-model="gender" /> 남성</label> &nbsp;
      <label><input type="radio" value="여성" v-model="gender" /> 여성</label>
      <p>
        데이터 상태: <span>{{ gender }}</span>
      </p>
    </div>

    <div>
      <h3>5) Select (드롭다운 선택)</h3>
      <select v-model="selectedCar">
        <option value="">-- 선택하세요 --</option>
        <option value="tesla">테슬라</option>
        <option value="hyundai">현대자동차</option>
        <option value="bmw">BMW</option>
      </select>
      <p>
        데이터 상태: <span>{{ selectedCar }}</span>
      </p>
    </div>
  </div>
</template>
