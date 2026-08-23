<!--
  ============================================================
  교재 113~114p | Vue Style (Scoped Style + External Style)
  ============================================================
  [핵심] SFC의 세 번째 방 <style>을 어떻게 쓰느냐

  ▪ <style>         → 이 컴포넌트에 썼어도 **프로젝트 전체**에 적용된다 (전역)
  ▪ <style scoped>  → 이 컴포넌트 안의 태그에만 적용된다 (다른 컴포넌트에 영향 없음)

  ★ scoped를 빼먹으면 전역으로 새어 나간다. 이게 가장 흔한 실수. ★
    예를 들어 여기서 `.title { color: red }` 를 scoped 없이 쓰면,
    다른 컴포넌트의 .title까지 전부 빨개진다.

  [비유] scoped는 **내 방에만 칠하는 페인트**, 없으면 **집 전체에 칠하는 페인트**.
         같은 이름의 클래스를 다른 컴포넌트가 쓰고 있어도 서로 안 건드린다.

  [동작 원리] Vue가 빌드할 때 각 태그에 `data-v-abc123` 같은 고유 속성을 붙이고,
              CSS 선택자도 `.title[data-v-abc123]` 으로 바꿔치기한다.
              → 개발자도구로 이 컴포넌트의 <p>를 열어보면 실제로 확인할 수 있다.

  ▪ External Style — 외부 CSS를 쓰는 3가지 위치 (교재 113p)
    1. 프로젝트 전체 공통 스타일 → `src/main.js` 에 등록
       (이 프로젝트의 `import './assets/main.css'` 가 그것)
    2. 특정 컴포넌트에만 외부 CSS → <style> 방 안에서 `@import` 사용   ← 아래 실습
    3. 여러 하위 컴포넌트에 함께 → App.vue의 scoped 없는 <style>에서 @import

  [이 컴포넌트에서 확인할 것]
    · `.title`        → 아래 <style scoped>에 정의 → 여기서만 빨간색
    · `.btn-external` → src/assets/challenge.css 에 정의 → @import로 가져옴 (전역)
    · `.practice-section` → src/assets/main.css 에 정의 → main.js가 등록 (전역)
    같은 화면에 세 가지 경로가 동시에 살아 있다.
-->
<script setup>
// 자바스크립트 방은 깨끗하게 비워둡니다.
</script>

<template>
  <div class="practice-section">
    <h2>Scoped 스타일 및 외부 CSS 활용</h2>
    <p class="title">이 글자는 이 컴포넌트 내부에서만 빨간색이 됩니다.</p>
    <button class="btn-external">외부 CSS에서 불러온 버튼 스타일</button>
  </div>
</template>

<style scoped>
/* 내 방 전용 타이틀 디자인 — 다른 컴포넌트의 .title에는 영향 없음 */
.title {
  color: #ff7675;
  font-weight: bold;
  font-size: 18px;
}
</style>

<style>
/* ⚠️ scoped가 없다 = 여기서 가져온 스타일은 전역에 적용된다 */
@import '@/assets/challenge.css';
</style>
