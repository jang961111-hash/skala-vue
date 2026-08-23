<!--
  ============================================================
  교재 231~248p | Element Plus — Code Challenge 246·247·248p
  ============================================================
  [UI 라이브러리를 왜 쓰나]
    Vue 는 컴포넌트 기반이고, 컴포넌트의 목표는 **재사용**이다.
    그래서 외부에서 "이거 가져다 쓰세요" 하고 만들어 둔 것이 UI 라이브러리다.

  ★★ 교수님 강조 — 이게 이 단원의 핵심 ★★
      "웹 라이브러리를 **예쁘다고 쓰는 게 아니에요.**
       그 안에 쓰이는 **기능들**이 있어요."

    날짜 범위 선택, 클리어 버튼 달린 입력창, 트리, 페이지네이션 —
    직접 만들려면 오래 걸리는 **기능**을 가져다 쓰는 것이다.
    디자인이 마음에 안 들면 CSS 로 덮어쓰면 된다.

  [시장 상황] 특별히 선점한 라이브러리가 없다 (교수님: "춘추전국시대")
    PrimeVue / Vuetify / Element Plus / Ant Design Vue …
    프로젝트마다 프론트엔드 쪽에서 하나를 고른다.
    여기서는 교재를 따라 Element Plus 를 쓴다.

  [실무에서의 사용법] (교수님)
    라이브러리 컴포넌트를 그대로 쓰는 게 아니라,
    **그걸 기반으로 우리 회사·우리 업무만의 컴포넌트를 만들어** 재사용한다.

  ▸ 설치와 등록 (교재 235~236p)
      npm install element-plus
      main.js 에서  app.use(ElementPlus)  +  CSS import
      → 전역 등록이므로 각 컴포넌트에서 import 없이 <el-*> 를 바로 쓴다
        (교재 150p 전역 등록의 실제 사례)
  ============================================================
-->
<script setup>
import { ref } from 'vue'
// ElMessage / ElMessageBox 는 컴포넌트가 아니라 **함수형 API** 라 개별 import 한다
import { ElMessage, ElMessageBox } from 'element-plus'

/* ── 246p: 회원가입 폼 ── */
const userForm = ref({
  email: '',
  agree: false,
})

const handleRegister = () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.error('❌ 올바른 이메일 형식이 아닙니다.')
    return
  }
  if (!userForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }
  ElMessage.success('🎉 가입 신청이 정상적으로 완료되었습니다!')
}

/* ── 247p: 수량·별점 ── */
const productQuantity = ref(1) // 수량 카운터 기본값
const productRate = ref(4) // 별점 기본값 (별 4개)

/* ── 248p: 진행률·확인창 ── */
const downloadProgress = ref(0)
const isDownloading = ref(false)

const confirmDelete = () => {
  // Promise 기반이다. 확인 → then, 취소 → catch
  ElMessageBox.confirm('서버에서 해당 파일을 영구히 삭제하시겠습니까?', '🔥 최종 경고', {
    confirmButtonText: '네, 삭제합니다',
    cancelButtonText: '취소',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('🗑️ 파일이 안전하게 파쇄되었습니다.')
    })
    .catch(() => {
      ElMessage.info('❌ 삭제 작업이 취소되었습니다.')
    })
}

const startDownload = () => {
  if (isDownloading.value) return
  isDownloading.value = true
  downloadProgress.value = 0
  const interval = setInterval(() => {
    downloadProgress.value += 20
    if (downloadProgress.value >= 100) {
      clearInterval(interval)
      isDownloading.value = false
      ElMessage.success('💾 대용량 데이터 로드가 완료되었습니다!')
    }
  }, 400)
}
</script>

<template>
  <div class="practice-section">
    <h2>Element Plus 컴포넌트 활용</h2>

    <!-- ── 246p ── -->
    <el-card class="ep-card">
      <template #header>
        <b>246p — 회원가입 폼 (Form + Feedback)</b>
      </template>

      <el-input v-model="userForm.email" placeholder="이메일 주소" clearable />
      <div class="row">
        <span>이용약관 동의</span>
        <el-switch v-model="userForm.agree" />
      </div>
      <el-button type="primary" @click="handleRegister">회원가입</el-button>

      <p class="note">
        ※ <code>clearable</code> 하나로 입력창에 지우기 버튼이 생깁니다. 직접 만들려면
        상태·아이콘·클릭 처리를 다 짜야 하는 기능입니다.
      </p>
    </el-card>

    <!-- ── 247p ── -->
    <el-card class="ep-card">
      <template #header>
        <b>247p — 구매 수량 · 별점 (Data 입력)</b>
      </template>

      <div class="row">
        <span>구매 수량</span>
        <el-input-number v-model="productQuantity" :min="1" :max="99" />
      </div>
      <div class="row">
        <span>만족도</span>
        <el-rate v-model="productRate" show-score />
      </div>
      <p class="note">
        선택한 값: 수량 <b>{{ productQuantity }}</b
        >개 / 별점 <b>{{ productRate }}</b
        >점
      </p>
    </el-card>

    <!-- ── 248p ── -->
    <el-card class="ep-card">
      <template #header>
        <b>248p — 진행률 · 확인창 (Feedback)</b>
      </template>

      <el-progress :percentage="downloadProgress" :stroke-width="14" />
      <div class="row">
        <el-button type="primary" :loading="isDownloading" @click="startDownload">
          {{ isDownloading ? '동기화 중…' : '데이터 동기화 시작' }}
        </el-button>
        <el-button type="danger" plain @click="confirmDelete">파일 삭제 테스트</el-button>
      </div>
      <p class="note">
        ※ <code>ElMessageBox.confirm</code> 은 Promise 를 돌려줍니다. 확인 → <code>then</code>, 취소
        → <code>catch</code>.
      </p>
    </el-card>
  </div>
</template>

<style scoped>
.ep-card {
  margin-bottom: 14px;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
  flex-wrap: wrap;
}
.note {
  margin-top: 10px;
  font-size: 0.78rem;
  opacity: 0.7;
}
code {
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(127, 127, 127, 0.15);
}
</style>
