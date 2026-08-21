import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  /* ================================================================
     [교재 256p / 270p] Custom Rules
     ================================================================
     ▸ 위치가 중요하다 (교재 256p)
       "JavaScript 배열은 하단에 위치할 수록 앞서 로드된 기본 규칙을 덮어쓴다."
       그래서 js.configs.recommended 와 pluginVue 보다 **아래**,
       skipFormatting 바로 **위**에 둔다.
       위에 두면 표준 추천 규칙이 이 설정을 덮어써서 아무 효과가 없다.

     ▸ 규칙 강도는 3단계 — 'error' / 'warn' / 'off'

     ▸ 왜 no-console 을 off 로 두나
       개발 중에는 console.log 가 필요하다. 다만 교수님 말씀대로
       프로덕션에서는 반대다. 콘솔 로그로 내부 정보가 새면 분석의 실마리가
       되기 때문에, 실무 CI/CD 에서는 이 규칙을 error 로 올려 배포를 막는다.
     ================================================================ */
  {
    name: 'app/custom-rules',
    rules: {
      // [270p 미션] 느슨한 비교(==) 를 에러로 막는다.
      // JS 의 == 는 타입을 보지 않고 값만 본다. '20' == 20 이 true 가 되는
      // 암묵적 형변환이 버그의 원인이 되므로 === 를 강제한다.
      eqeqeq: ['error', 'always'],

      // 개발 편의를 위해 console.log 허용 (프로덕션에서는 올려야 함)
      'no-console': 'off',

      // 선언 후 사용하지 않는 변수는 경고까지만.
      // error 로 두면 개발 중 임시 변수마다 걸려 작업이 끊긴다.
      'no-unused-vars': 'warn',

      // 컴포넌트명 두 단어 규칙 해제.
      // 스캐폴딩이 만든 HomeView 등 한 단어 컴포넌트를 허용하기 위함.
      'vue/multi-word-component-names': 'off',
    },
  },

  skipFormatting,
])
