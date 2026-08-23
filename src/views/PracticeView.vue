<!--
  ================================================================
  PracticeView.vue | 라우트 "/practice"
  ================================================================
  교재 60p~248p 의 **연습 · 실습 · Code Challenge** 를 모아 둔 화면이다.

  ▸ 왜 따로 모았나
      과제(Hands on)는 하나의 날씨 앱으로 이어지지만, 단원마다 나오는
      작은 실습들은 서로 이어지지 않는다. 각각을 독립 컴포넌트로 만들고
      여기서 골라 실행하도록 했다.

  ▸ 원래는 별도 프로젝트에 두었다
      제출물에 과제 코드만 남기려고 연습장 프로젝트를 따로 만들어 썼는데,
      실습 참여도 평가 대상이라 제출 저장소로 합쳤다.

  ▸ 이 화면에 쓰인 문법도 교재 범위 안이다
      v-for + :key (88p) / :class 객체구문 (79p) / @click (100p)
      <component :is> 동적 컴포넌트, shallowRef
  ================================================================
-->
<script setup>
import { shallowRef } from 'vue'

// 60~72p | 학습환경 구성
import SampleOne from '../components/practices/basic/SampleOne.vue'
import SampleTwo from '../components/practices/basic/SampleTwo.vue'

// 73~92p | Vue Directive
import VHtmlSample from '../components/practices/directive/VHtmlSample.vue'
import VHtmlXssSample from '../components/practices/directive/VHtmlXssSample.vue'
import VTextSample from '../components/practices/directive/VTextSample.vue'
import VBindBasic from '../components/practices/directive/VBindBasic.vue'
import VBindClass from '../components/practices/directive/VBindClass.vue'
import VBindStyle from '../components/practices/directive/VBindStyle.vue'
import VBindShorthand from '../components/practices/directive/VBindShorthand.vue'
import VIfSample from '../components/practices/directive/VIfSample.vue'
import VShowSample from '../components/practices/directive/VShowSample.vue'
import VForSample from '../components/practices/directive/VForSample.vue'
import VPreSample from '../components/practices/directive/VPreSample.vue'
import VCloakSample from '../components/practices/directive/VCloakSample.vue'
import VOnceSample from '../components/practices/directive/VOnceSample.vue'
import VMemoSample from '../components/practices/directive/VMemoSample.vue'

// 94~105p | Vue Event Handling
import VOnBasic from '../components/practices/event/VOnBasic.vue'
import EventObjectSample from '../components/practices/event/EventObjectSample.vue'
import EventModifierSample from '../components/practices/event/EventModifierSample.vue'

// 106~115p | Form Data Binding & Vue Style
import VModelBasic from '../components/practices/form/VModelBasic.vue'
import FormElementsSample from '../components/practices/form/FormElementsSample.vue'
import VModelModifiers from '../components/practices/form/VModelModifiers.vue'
import VueStyleSample from '../components/practices/form/VueStyleSample.vue'

// 117~144p | Composition API
import ReactiveRef from '../components/practices/composition/ReactiveRef.vue'
import ReactiveReactive from '../components/practices/composition/ReactiveReactive.vue'
import ComputedBasic from '../components/practices/composition/ComputedBasic.vue'
import WatchersBasic from '../components/practices/composition/WatchersBasic.vue'
import WatchersMulti from '../components/practices/composition/WatchersMulti.vue'
import WatchersDeep from '../components/practices/composition/WatchersDeep.vue'
import WatchersReactive from '../components/practices/composition/WatchersReactive.vue'
import WatchersRefArray from '../components/practices/composition/WatchersRefArray.vue'
import WatchersReactiveArray from '../components/practices/composition/WatchersReactiveArray.vue'
import WatchersWatchEffect from '../components/practices/composition/WatchersWatchEffect.vue'

// 146~177p | Vue Components
import LifecycleParent from '../components/practices/component/LifecycleParent.vue'
import PropsEmitsParent from '../components/practices/component/PropsEmitsParent.vue'
import ProvideInjectParent from '../components/practices/component/ProvideInjectParent.vue'
import SlotDefaultParent from '../components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from '../components/practices/component/SlotNamedParent.vue'
import SlotScopedParent from '../components/practices/component/SlotScopedParent.vue'

// 198~211p | Pinia
import StoreCounter from '../components/practices/library/StoreCounter.vue'
import AxiosJson from '../components/practices/library/AxiosJson.vue'
import AxiosWeather from '../components/practices/library/AxiosWeather.vue'
import ElementPlusDemo from '../components/practices/library/ElementPlus.vue'

// 교재 순서 그대로 정렬한 실습 목록
const menus = [
  { page: 70, label: '반응형 데이터 (ref)', comp: SampleOne, group: '학습환경 구성' },
  { page: 71, label: 'Text Interpolation', comp: SampleTwo, group: '학습환경 구성' },

  { page: 74, label: 'v-html', comp: VHtmlSample, group: 'Vue Directive' },
  { page: 75, label: 'v-html XSS ⚠️', comp: VHtmlXssSample, group: 'Vue Directive' },
  { page: 76, label: 'v-text', comp: VTextSample, group: 'Vue Directive' },
  { page: 77, label: 'v-bind 기본', comp: VBindBasic, group: 'Vue Directive' },
  { page: 79, label: 'v-bind 클래스 바인딩', comp: VBindClass, group: 'Vue Directive' },
  { page: 81, label: 'v-bind 스타일 바인딩', comp: VBindStyle, group: 'Vue Directive' },
  { page: 83, label: 'v-bind 단축 문법', comp: VBindShorthand, group: 'Vue Directive' },
  { page: 84, label: 'v-if / v-else-if / v-else', comp: VIfSample, group: 'Vue Directive' },
  { page: 85, label: 'v-show', comp: VShowSample, group: 'Vue Directive' },
  { page: 88, label: 'v-for', comp: VForSample, group: 'Vue Directive' },
  { page: 89, label: 'v-pre', comp: VPreSample, group: 'Vue Directive' },
  { page: 90, label: 'v-cloak', comp: VCloakSample, group: 'Vue Directive' },
  { page: 91, label: 'v-once', comp: VOnceSample, group: 'Vue Directive' },
  { page: 92, label: 'v-memo', comp: VMemoSample, group: 'Vue Directive' },

  { page: 96, label: 'v-on 이벤트 핸들러', comp: VOnBasic, group: 'Event Handling' },
  { page: 100, label: 'Event Object ($event)', comp: EventObjectSample, group: 'Event Handling' },
  { page: 102, label: 'Event Modifier', comp: EventModifierSample, group: 'Event Handling' },

  { page: 106, label: 'v-model 양방향 바인딩', comp: VModelBasic, group: 'Form Data Binding' },
  {
    page: 109,
    label: 'Form 요소별 v-model 매핑',
    comp: FormElementsSample,
    group: 'Form Data Binding',
  },
  { page: 112, label: 'v-model Modifiers', comp: VModelModifiers, group: 'Form Data Binding' },
  { page: 114, label: 'Vue Style (scoped/외부CSS)', comp: VueStyleSample, group: 'Vue Style' },

  { page: 122, label: 'ref()', comp: ReactiveRef, group: 'Composition API' },
  { page: 124, label: 'reactive()', comp: ReactiveReactive, group: 'Composition API' },
  { page: 128, label: 'computed() 캐싱 비교', comp: ComputedBasic, group: 'Composition API' },
  { page: 131, label: 'watch() 기본', comp: WatchersBasic, group: 'Composition API' },
  { page: 133, label: 'watch() 다중 감시', comp: WatchersMulti, group: 'Composition API' },
  { page: 136, label: 'watch() Deep (ref 객체)', comp: WatchersDeep, group: 'Composition API' },
  { page: 139, label: 'watch() reactive 규칙', comp: WatchersReactive, group: 'Composition API' },
  { page: 140, label: 'watch() ref 배열', comp: WatchersRefArray, group: 'Composition API' },
  {
    page: 141,
    label: 'watch() reactive 배열',
    comp: WatchersReactiveArray,
    group: 'Composition API',
  },
  { page: 142, label: 'watchEffect()', comp: WatchersWatchEffect, group: 'Composition API' },

  { page: 154, label: 'Lifecycle Hook', comp: LifecycleParent, group: 'Vue Components' },
  { page: 168, label: 'Props & Emits', comp: PropsEmitsParent, group: 'Vue Components' },
  { page: 171, label: 'Provide & Inject', comp: ProvideInjectParent, group: 'Vue Components' },
  { page: 174, label: 'Slot — Default', comp: SlotDefaultParent, group: 'Vue Components' },
  { page: 175, label: 'Slot — Named', comp: SlotNamedParent, group: 'Vue Components' },
  { page: 176, label: 'Slot — Scoped', comp: SlotScopedParent, group: 'Vue Components' },

  { page: 204, label: 'Pinia Store (counter)', comp: StoreCounter, group: 'Pinia' },

  { page: 228, label: 'Axios JSON (REST CRUD)', comp: AxiosJson, group: 'Axios' },
  { page: 224, label: 'Axios Weather (API키 필요)', comp: AxiosWeather, group: 'Axios' },

  { page: 246, label: 'Element Plus 컴포넌트', comp: ElementPlusDemo, group: 'UI Libraries' },
]

// 현재 선택된 실습
// ※ ref()가 아니라 shallowRef()를 쓴 이유:
//   menus의 각 항목에는 "컴포넌트 객체"가 들어 있다. ref()로 감싸면 Vue가
//   컴포넌트 내부까지 전부 반응형으로 만들려 하면서 불필요한 성능 부담이 생기고
//   콘솔에 경고가 뜬다. shallowRef는 "겉껍데기(교체 여부)만 감시"하므로 딱 맞는다.
const current = shallowRef(menus[0])
</script>

<template>
  <header>
    <h1>단원별 실습 · Code Challenge</h1>
    <p class="sub">
      교재 60p ~ 248p 의 연습 · 실습 · Code Challenge 를 단원 순서대로 모았습니다. 왼쪽에서 고르면
      오른쪽에서 바로 동작합니다.
    </p>
  </header>

  <div class="layout">
    <!-- 왼쪽: 실습 목록 (v-for + :key + :class + @click 모두 60~105p 범위) -->
    <nav class="menu">
      <button
        v-for="menu in menus"
        :key="menu.page"
        :class="{ active: current.page === menu.page }"
        @click="current = menu"
      >
        <span class="page">{{ menu.page }}p</span>
        {{ menu.label }}
      </button>
    </nav>

    <!-- 오른쪽: 선택된 실습 컴포넌트가 마운트되는 자리 -->
    <main class="stage">
      <p class="crumb">{{ current.group }} · 교재 {{ current.page }}p</p>
      <component :is="current.comp" />
    </main>
  </div>
</template>

<style scoped>
header {
  margin-bottom: 20px;
  border-bottom: 2px solid #42b883;
  padding-bottom: 12px;
}
header h1 {
  font-size: 1.5rem;
  font-weight: 700;
}
.sub {
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 4px;
}
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  align-items: start;
}
.menu {
  display: flex;
  flex-direction: column;
  gap: 3px;
  position: sticky;
  top: 20px;
}
.menu button {
  text-align: left;
  padding: 7px 10px;
  font-size: 0.88rem;
  border: none;
  border-left: 3px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.menu button:hover {
  background: rgba(66, 184, 131, 0.12);
}
.menu button.active {
  border-left-color: #42b883;
  background: rgba(66, 184, 131, 0.2);
  font-weight: 700;
}
.menu .page {
  display: inline-block;
  min-width: 40px;
  font-size: 0.75rem;
  opacity: 0.6;
}
.crumb {
  font-size: 0.8rem;
  opacity: 0.6;
  margin-bottom: 8px;
}

/* 화면이 좁으면 1단으로 */
@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .menu {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
