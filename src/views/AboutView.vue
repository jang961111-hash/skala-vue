<!--
  ================================================================
  AboutView.vue | 라우트 "/about" 의 화면
  ================================================================
  프로젝트 소개 페이지.
  교재 4p [과제 제출] 의 "각 단원 별 실습이 진행될 때 마다, 과제와 관련하여
  개인별 Customization 한 내역을 잘 기록한다" 항목을 화면에서도 볼 수 있게
  정리했다. (README.md 와 같은 내용을 화면용으로 요약)

  사용한 문법은 전부 교재 60p~116p 범위 안이다.
    · v-for + :key   (88p)  — 요구사항 목록 / 문법 목록 렌더링
    · v-if / v-else  (84p)  — 진행 상태에 따른 배지 분기
    · :class 객체구문 (79p)  — 상태별 배지 색상
  ================================================================
-->
<script setup>
import { ref } from 'vue'

// 교재 116p 과제 요구사항 5개와 구현 상태
const requirements = ref([
  {
    id: 'req_1',
    title: '배열 렌더링 (v-for)',
    detail: 'weatherList 를 카드로 반복 출력, :key 에 고유 id 바인딩',
    page: '88p',
    done: true,
  },
  {
    id: 'req_2',
    title: '조건부 렌더링 (v-if)',
    detail: '25도 기준 🔥 더움 / ❄️ 선선함 라벨 분기',
    page: '84p',
    done: true,
  },
  {
    id: 'req_3',
    title: '양방향 바인딩 · 한글 처리',
    detail: 'v-model 이 아닌 :value + @input 조합으로 한글 실시간 반영',
    page: '106p',
    done: true,
  },
  {
    id: 'req_4',
    title: '이벤트 및 수식어',
    detail: '카드 @click 선택 / [상세보기] @click.stop 으로 버블링 차단',
    page: '102p',
    done: true,
  },
  {
    id: 'req_5',
    title: '본인 데이터 추가 및 확장',
    detail: '체감온도·습도·풍속 필드 추가, 도시 6곳, 검색·강수 필터·요약 통계',
    page: '—',
    done: true,
  },
])

// 개인 확장 내역
const extras = ref([
  { id: 'ex_1', label: '검색 필터 연동', syntax: 'v-for + filter' },
  { id: 'ex_2', label: '비 오는 지역만 보기 토글', syntax: 'v-model 체크박스' },
  { id: 'ex_3', label: '요약 통계 (도시 수 / 평균 기온)', syntax: 'Text Interpolation 표현식' },
  { id: 'ex_4', label: '빈 상태 안내', syntax: 'v-if' },
  { id: 'ex_5', label: '선택 카드 하이라이트', syntax: ':class 객체 구문' },
  { id: 'ex_6', label: '기온별 배지 색상', syntax: ':style' },
])
</script>

<template>
  <main class="about">
    <header class="about-head">
      <p class="kicker">SKALA Full-Stack Engineering</p>
      <h1>Frontend-framework: Vue.js</h1>
      <p class="desc">
        강병호 강사님 강의 실습 저장소입니다. 교재 116p
        <b>Hands on — Weather Mockup</b> 과제를 중심으로, 단원별 실습 내용과 개인 커스터마이징
        내역을 기록합니다.
      </p>
      <ul class="stack">
        <li>Vue 3.5</li>
        <li>Vite 8</li>
        <li>Vue Router 5</li>
        <li>Pinia 3</li>
        <li>ESLint + Prettier</li>
      </ul>
    </header>

    <section>
      <h2>과제 요구사항 구현 현황</h2>
      <ul class="req-list">
        <li v-for="req in requirements" :key="req.id" class="req">
          <div class="req-top">
            <h3>{{ req.title }}</h3>
            <!-- v-if / v-else 로 상태 배지를 갈아 끼운다 -->
            <span v-if="req.done" class="badge badge-done">완료</span>
            <span v-else class="badge badge-todo">진행 중</span>
          </div>
          <p class="req-detail">{{ req.detail }}</p>
          <span class="req-page">교재 {{ req.page }}</span>
        </li>
      </ul>
    </section>

    <section>
      <h2>개인 확장 내역</h2>
      <ul class="extra-list">
        <li v-for="ex in extras" :key="ex.id">
          <span class="ex-label">{{ ex.label }}</span>
          <code>{{ ex.syntax }}</code>
        </li>
      </ul>
    </section>

    <section>
      <h2>기록해 둔 판단</h2>
      <dl class="notes">
        <dt>요구사항 3에서 v-model 을 쓰지 않은 이유</dt>
        <dd>
          v-model 은 내부에 IME 조합 가드가 있어 <b>ㅅ → 서 → 설</b> 처럼 자모가 모여 한 글자가
          완성될 때까지 변수 갱신을 미룹니다. :value + @input 은 조합 중인 자모까지 실시간으로
          잡아내므로, 검색어처럼 치는 즉시 반응해야 하는 UI 에 맞습니다.
        </dd>
        <dt>[상세보기] 버튼에 .stop 이 필요한 이유</dt>
        <dd>
          버튼이 카드(부모) 내부에 있어 .stop 이 없으면 버튼 클릭이 부모 카드의 @click 까지 연쇄로
          발동합니다. alert 도 뜨고 선택 도시도 함께 바뀌는 이중 발동이 일어납니다.
        </dd>
        <dt>computed 를 쓰지 않은 이유</dt>
        <dd>
          파생 데이터는 computed 로 만드는 것이 정석이지만, computed 는 교재 117p 이후 내용입니다.
          Day 2 범위(60p~116p) 문법만으로 구현하기 위해 일반 함수로 대체했고, 해당 단원 학습 후
          리팩터링할 지점으로 코드 주석에 표시해 두었습니다.
        </dd>
      </dl>
    </section>
  </main>
</template>

<style scoped>
.about {
  max-width: 820px;
  margin: 0 auto;
  padding: 36px 20px 60px;
  display: flex;
  flex-direction: column;
  gap: 36px;
  line-height: 1.7;
}

.kicker {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6366f1;
  font-weight: 600;
}

.about-head h1 {
  margin: 6px 0 10px;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.desc {
  color: var(--color-text);
  opacity: 0.85;
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
}

.stack li {
  font-size: 0.76rem;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  opacity: 0.85;
}

section h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.req-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.req {
  border: 1px solid var(--color-border);
  border-left: 3px solid #6366f1;
  border-radius: 8px;
  padding: 13px 16px;
}

.req-top {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.req-top h3 {
  font-size: 0.98rem;
  font-weight: 650;
}

.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 999px;
}

.badge-done {
  background: rgba(6, 182, 212, 0.16);
  color: #0369a1;
}

.badge-todo {
  background: rgba(249, 115, 22, 0.16);
  color: #c2410c;
}

.req-detail {
  font-size: 0.86rem;
  opacity: 0.8;
  margin-top: 4px;
}

.req-page {
  display: inline-block;
  margin-top: 6px;
  font-size: 0.72rem;
  opacity: 0.6;
}

.extra-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 8px;
}

.extra-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 13px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.85rem;
}

.extra-list code {
  font-size: 0.72rem;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
  white-space: nowrap;
}

.notes {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notes dt {
  font-weight: 650;
  font-size: 0.92rem;
  margin-bottom: 4px;
}

.notes dd {
  margin: 0;
  font-size: 0.86rem;
  opacity: 0.85;
  padding-left: 12px;
  border-left: 2px solid var(--color-border);
}

@media (max-width: 560px) {
  .extra-list {
    grid-template-columns: 1fr;
  }
}
</style>
