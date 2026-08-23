# skala-vue

SKALA Full-Stack Engineering — Frontend-framework: Vue.js (강병호 교수님, 2026.08.18~08.21) 과제 저장소.

교재 `Weather` 과제를 116p → 145p → 178p → 196p → 212p → 230p → 249p 순서로
**같은 앱을 계속 고쳐 가며** 만들었다. 단원마다 새로 만들지 않고 이전 결과물을 리팩터링했기 때문에,
각 단계에서 무엇이 왜 바뀌었는지가 이 문서의 중심이다.

- 배포: https://jang961111-hash.github.io/skala-vue/
- 소스: https://github.com/jang961111-hash/skala-vue

## 화면

| 대시보드                                       | 검색 · 필터                                    | 상세 · 예보                                      |
| ---------------------------------------------- | ---------------------------------------------- | ------------------------------------------------ |
| ![대시보드](docs/screenshots/01-dashboard.jpg) | ![검색](docs/screenshots/02-search-filter.jpg) | ![상세](docs/screenshots/04-detail-forecast.jpg) |

## 실행 방법

```bash
npm install
cp .env.example .env.local     # VITE_OPENWEATHER_API_KEY 에 본인 키 입력
npm run dev                    # http://localhost:3000
```

키가 없어도 실행된다. Mock 데이터로 화면이 뜨고 상단에 안내 배너가 나온다.

`npm run dev` 로 띄워 두고 `.vue` 파일을 고치면 새로고침 없이 화면만 바뀐다(HMR).
페이지 전체를 다시 그리는 게 아니라 바뀐 컴포넌트만 갈아 끼우기 때문에,
입력창에 쳐 둔 검색어나 열어 둔 상태가 그대로 남는다. 이게 없었으면 매번 처음부터 다시 눌러야 했다.

**Vue Devtools** 는 브라우저에서 반응형 데이터를 직접 들여다볼 때 썼다.
단위 토글을 눌렀을 때 Pinia 탭의 `configStore.unit` 이 실제로 바뀌는지,
카드가 안 바뀌는 게 스토어 문제인지 화면 문제인지 여기서 갈랐다.
`import.meta.env` 값이 빌드 모드마다 뭘로 들어왔는지도 여기서 확인했다.

```bash
npm run lint              # ESLint + Oxlint
npm run format            # Prettier
npm run build             # dist/ 생성
npm run preview           # 빌드 결과물을 정적 서버로 확인
npm run build:staging     # .env.staging 을 읽어 빌드
npm run build:production  # .env.production 을 읽어 빌드
```

## 라우팅

| 경로               | 화면      | 비고                                      |
| ------------------ | --------- | ----------------------------------------- |
| `/`                | 대시보드  | 도시 카드 6개, 검색, 강수 필터            |
| `/weather/:cityId` | 상세      | 동적 세그먼트. 3시간 단위 예보            |
| `/stats`           | 통계      | `?sort=` 쿼리스트링으로 정렬              |
| `/about`           | 소개      | 구현 현황, 빌드 환경 변수 표시            |
| `/history/*`       | 학습 이력 | 116p·145p·178p 버전을 지우지 않고 남겨 둠 |
| `/:pathMatch(.*)*` | 404       | 반드시 맨 마지막에 등록                   |

## 실습 단원별 위치

과제 기준표의 10개 실습 단원이 저장소 어디에 있는지 정리했다.

| 단원 | 실습명                      | 결과물                                      | 문서                                                     |
| ---- | --------------------------- | ------------------------------------------- | -------------------------------------------------------- |
| 1    | Vue.js 시작하기             | 프로젝트 전체, `vite.config.js`             | [실행 방법](#실행-방법)                                  |
| 2    | Vue 문법                    | `components/handson/WeatherMockup.vue`      | [116p](#116p--weather-mockup-v-directive)                |
| 3    | Composition API             | `components/handson/WeatherComposition.vue` | [145p](#145p--weather-composition)                       |
| 4    | Vue Component               | `components/handson/weather/` (5개)         | [178p](#178p--weather-component)                         |
| 5    | Vue Router                  | `router/index.js`, `views/`                 | [196p](#196p--weather-router)                            |
| 6    | Pinia                       | `stores/` (3개)                             | [212p](#212p--weather-store-pinia)                       |
| 7    | Axios                       | `api/weatherApi.js`                         | [230p](#230p--axios--외부-api)                           |
| 8    | UI 라이브러리               | `views/WeatherDetailView.vue`               | [UI 라이브러리](#ui-라이브러리를-어디에-어떻게-적용했나) |
| 9    | 외부 라이브러리로 과제 확장 | `api/weatherApi.js` 의 대기오염 연동        | [9단원 확장](#9단원--외부-api-를-더-붙여서-과제-확장)    |
| 10   | Vite 빌드 및 배포           | `.github/workflows/deploy.yml`              | [배포](#배포)                                            |

라우트는 전부 `() => import()` 지연 로딩이다. 빌드하면 화면별로 청크가 쪼개지는 것을 `dist/assets/` 에서 확인할 수 있다.

---

# 단원별로 무엇을 만들고 무엇을 바꿨나

## 116p — Weather Mockup (v-directive)

한 파일 안에 전부 넣었다. `weatherList` 배열을 `v-for` 로 뿌리고, 25도 기준으로 `v-if`/`v-else` 라벨을 붙이고,
카드 클릭 이벤트와 `.stop` 을 붙인 상세보기 버튼까지가 요구사항이었다.

**요구사항 3에서 `v-model` 을 쓰지 않았다.**
검색창에 `v-model` 을 걸었더니 "ㅅ → 서 → 설" 처럼 자모가 모여 한 글자가 완성될 때까지 변수가 안 바뀌었다.
`v-model` 안에 IME 조합 가드가 있어서 그렇다. 검색어는 치는 즉시 반응해야 해서 `:value` + `@input` 으로 바꿨다.
`v-model` 이 결국 `:value` + `@input` 의 문법 설탕이라는 걸 이때 몸으로 알았다.

**`.stop` 이 왜 필요한지도 빼보고 알았다.**
상세보기 버튼이 카드 안에 있어서, `.stop` 을 빼면 버튼을 누를 때 부모 카드의 `@click` 까지 같이 터졌다.
alert 도 뜨고 선택 도시도 바뀌는 이중 발동이 눈에 보였다.

**이 단계에서 computed 를 일부러 안 썼다.** 평균 기온 같은 파생 데이터를 일반 함수로 계산했는데,
computed 는 117p 이후 내용이라 Day2 범위 문법만으로 만들어 보고 싶었다. 리팩터링 지점은 주석에 표시해 뒀다.

## 145p — Weather Composition

일반 함수로 계산하던 것들을 `computed` 로 바꿨다. computed 는 의존하는 값이 안 바뀌면 재계산을 건너뛴다.
일반 함수는 화면이 다시 그려질 때마다 매번 다시 돈다. 화면상 결과는 같은데 동작이 다르다는 게 이 단원의 핵심이었다.

`watch` 와 `watchEffect` 는 기준을 정해서 나눠 썼다.

- 무엇이 바뀌었는지 구분해야 하거나 이전 값이 필요하면 `watch`
- 마운트 시점에 한 번 돌아야 하거나 여러 값을 그냥 따라가면 되면 `watchEffect`

### 교재만 보고 짠 다음 참조 구현과 대조해 봤다

이 과제는 교재만 보고 먼저 구현한 뒤, 교수님 참조 저장소를 열어 비교했다.
뼈대와 변수명(`weatherList` / `searchQuery` / `selectedCityInfo` / `showDetail`)이 그대로 일치했다.
교재 문장을 읽고 예상한 구조가 실제 구현과 같았다는 게 스스로 확인이 됐다.

차이는 하나 찾았다. 필터 함수에서 검색어가 비었을 때 곧바로 전체를 돌려주는 early return 이 있었고,
매번 필터를 도는 내 코드보다 나아서 그것만 반영했다.

## 178p — Weather Component

한 파일이던 것을 5개로 쪼갰다.

| 컴포넌트            | 역할                            |
| ------------------- | ------------------------------- |
| `WeatherParent`     | 상태를 갖고 자식에게 내려 줌    |
| `SearchBar`         | props 로 값 받고 emits 로 올림  |
| `WeatherCard`       | 카드 하나. 단위 변환 · 즐겨찾기 |
| `StatSummary`       | 표시 전용                       |
| `BaseDashboardCard` | slot 으로 껍데기만 제공         |

`defineProps` / `defineEmits` 는 **선언은 camelCase, 템플릿 호출은 kebab-case** 로 갈린다.
`searchQuery` 로 선언하고 부모에서는 `:search-query`, 이벤트도 `update-query` 로 쓴다.
HTML 템플릿이 대소문자를 구분하지 않기 때문이다.

slot 중에 **Scoped Slot 이 방향이 반대**라는 게 제일 헷갈렸다.
props 는 부모 → 자식인데, scoped slot 은 자식이 가진 값을 부모가 받아서 모양을 정한다.

## 196p — Weather Router

화면을 URL 로 나눴다. 이전까지 `window.alert()` 로 띄우던 상세 정보를 `/weather/:cityId` 페이지로 옮겼다.
바뀐 건 사실상 이 한 줄이다.

```js
// 178p:  alert(`${city.name} 상세정보 ...`)
// 196p:  router.push(`/weather/${city.id}`)
```

동적 세그먼트와 쿼리스트링은 기준을 나눠 썼다.
**무엇을 보여줄지가 바뀌면 경로**(`/weather/city_01`), **같은 것을 어떻게 보여줄지가 바뀌면 쿼리**(`/stats?sort=temp`).
정렬을 경로로 만들면 라우트가 정렬 방식 수만큼 늘어난다.

Catch-all(`/:pathMatch(.*)*`)은 반드시 맨 마지막에 둬야 한다. 위에 두면 모든 경로를 먼저 잡아먹는다.

**없는 도시 ID 는 Catch-all 이 못 잡는다.** `/weather/city_99` 는 라우트 패턴에는 맞으므로 정상 진입하고,
데이터가 없어서 빈 화면이 된다. 그래서 컴포넌트 안에서 직접 찾고, 없으면 안내를 띄우도록 했다.

## 212p — Weather Store (Pinia)

단위(℃/℉) 토글을 헤더에 두려다 막혔다. 헤더는 `App.vue` 에 있고 실제로 온도를 쓰는 건 카드다.
props 로 내리려면 3단계를 거쳐야 했다. 중간 컴포넌트들은 그 값을 쓰지도 않으면서 통로 역할만 한다.
이게 props drilling 이고, 스토어로 빼면 어느 컴포넌트에서든 바로 꺼내 쓸 수 있다.

| 스토어          | 역할                                  |
| --------------- | ------------------------------------- |
| `configStore`   | 단위 상태, 변환 함수                  |
| `favoriteStore` | 즐겨찾기 ID 목록                      |
| `weatherStore`  | 도시 데이터, 로딩·에러 상태, API 호출 |

`storeToRefs` 는 쓰지 않았다. 템플릿에서 `configStore.unitSymbol` 처럼 **스토어 객체를 통해** 접근하면
구조분해를 한 게 아니라 반응성이 유지된다. `const { unit } = useConfigStore()` 처럼 꺼내 쓸 때만 필요하다(교재 205p).
"무조건 붙이는 것" 이 아니라 구조분해 여부에 따라 갈린다는 게 요점이었다.

## 230p — Axios · 외부 API

Mock 데이터를 OpenWeatherMap 실데이터로 바꿨다.
`axios.create` 로 인스턴스를 만들어 `baseURL` 과 공통 params(키·단위·언어)를 한 곳에 모았다.
호출부마다 키를 붙이지 않아도 되고, 나중에 서버가 바뀌어도 한 줄만 고치면 된다.

**`Promise.all` 이 아니라 `Promise.allSettled` 를 썼다.**
도시 6곳을 동시에 부르는데, `all` 은 하나만 실패해도 전체가 reject 된다.
서울이 실패했다고 부산까지 안 보여줄 이유가 없어서 `allSettled` 로 하고, 실패한 도시만 Mock 으로 대체했다.

---

# UI 라이브러리를 어디에 어떻게 적용했나

교재 249p 과제. **Element Plus 2.14.4** 를 골랐다.

`main.js` 에서 전역 등록했기 때문에 각 컴포넌트에서 import 없이 `<el-*>` 를 바로 쓴다.
교재 150p 에서 배운 전역 등록이 실제로 쓰인 곳이다.

```js
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)
```

## 적용 위치

| 위치                | 컴포넌트                                                                                                          | 무엇 때문에                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `WeatherDetailView` | `el-date-picker`                                                                                                  | **예보 날짜 선택** (아래 설명) |
| 연습 저장소         | `el-card` `el-input` `el-switch` `el-button` `el-input-number` `el-rate` `el-progress` `ElMessage` `ElMessageBox` | 교재 246~248p Code Challenge   |

## `el-date-picker` 를 고른 이유 — 예뻐서가 아니라 기능이 없어서

문제가 먼저 있었다. `/forecast` API 는 5일치를 3시간 간격으로 **40건** 준다.
그런데 내 화면은 앞 **8건**(약 하루치)만 쓰고 있었다. **나머지 4일치를 그냥 버리고 있었다.**

날짜를 고를 수 있으면 40건을 전부 쓸 수 있다.

```
선택 전    →  "3시간 단위 예보 (기본 8건)"   08-21 09:00 부터
8/23 선택  →  "2026-08-23 예보"  8건        08-23 00:00 ~ 21:00
```

달력을 직접 만들려면 월 이동, 요일 배치, 선택 상태, 비활성 날짜 처리를 전부 짜야 한다.
`el-date-picker` 는 props 몇 개로 끝난다. 라이브러리를 쓰는 이유가 이거라는 걸 이 지점에서 이해했다.

## `disabledDate` — 못 고르게 막는 쪽을 택했다

예보가 있는 날짜만 선택되게 했다.

```js
const disabledDate = (date) => !weatherStore.availableDates(city.value.id).includes(포맷된날짜)
```

"고를 수는 있는데 결과가 없다" 보다 **"애초에 못 고른다"** 가 쓰는 사람 입장에서 낫다고 판단했다.

스토어도 같이 고쳤다. 기존에는 `slice(0, 8)` 로 8건만 저장하고 나머지를 버렸는데,
40건을 전부 보관하고 `forecastByDate(cityId, date)` 로 걸러 쓰도록 바꿨다.

---

# 9단원 — 외부 API 를 더 붙여서 과제 확장

교수님이 수업에서 이렇게 말씀하셨다.

> "단순히 날씨 말고 다른 것들도 써봐서 더 데이터 가져올 수 있어야 합니다."
> "라이브러리 추가되면 데이터가 추가되는 거지. 데이터가 추가되면 거기에 또 구현할 게 쭉 늘어날 거야."

## 고친 지점 — 날씨는 진짜인데 미세먼지만 가짜였다

상세 페이지에 미세먼지가 떠 있었는데, 값이 Mock 에 하드코딩돼 있었다.

```js
observation: { station: 'SEL', pressure: 1008, visibility: 12, uv: 7, dust: '보통' }
```

기온·습도·풍속은 API 실데이터인데 대기질만 고정값이라 앞뒤가 안 맞았다.
**OpenWeather Air Pollution API** 로 바꿨다. 같은 키를 그대로 쓰므로 추가 발급이 필요 없었다.

|             | 전                | 후                                     |
| ----------- | ----------------- | -------------------------------------- |
| 미세먼지    | `'보통'` 하드코딩 | PM2.5 · PM10 실측 (㎍/㎥)              |
| 대기질 등급 | 없음              | AQI 1~5 → 좋음/보통/나쁨/매우나쁨/최악 |

## 여기서 호출 순서가 강제됐다

`/weather` 는 `q=Seoul` 처럼 **도시명**을 받는데, `/air_pollution` 은 **좌표(lat, lon)만** 받는다.
좌표를 도시마다 하드코딩해야 하나 싶었는데, `/weather` 응답 안에 `coord` 가 들어 있었다.

```
fetchCurrentWeather(도시명) → coord 획득 → fetchAirPollution(coord)
```

앞 호출의 결과가 뒤 호출의 입력이라 병렬로 못 돌린다.
도시 6곳은 서로 독립이라 `Promise.allSettled` 로 병렬이고, 그 안에서 이 두 개만 순차다.
**무엇이 병렬이고 무엇이 순차인지가 데이터 의존 관계로 정해진다**는 걸 이 지점에서 봤다.

좌표를 하드코딩하지 않았으니 도시를 추가해도 대기질이 저절로 따라온다.

## 대기질이 실패해도 날씨는 살린다

```js
const air = await fetchAirPollution(lat, lon)
  .then(toAirShape)
  .catch(() => null)
```

대기오염 호출이 터져도 `air` 만 `null` 이 되고 날씨는 그대로 뜬다.
화면에서는 `v-if="city.air"` 로 갈라서, 실데이터면 수치를, 아니면 Mock 값에 `Mock` 배지를 붙인다.
**지금 보는 게 진짜인지 아닌지 화면에서 구분되게** 하고 싶었다.

AQI 는 1~5 정수로만 오는데, 숫자만 보면 좋은지 나쁜지 모른다.
말(좋음~최악)과 색을 같이 붙였다.

# 겪은 문제와 거기서 배운 것

## API 키가 6개 도시 전부 401 났다

키를 넣고 새로고침했더니 6곳이 전부 401 이었다. 키 형식(32자 16진수)은 정상이었고,
발급 직후라 활성화 대기 상태였다. 10분쯤 뒤 저절로 풀렸다.

**여기서 앞의 선택이 우연히 증명됐다.** 6개가 전부 실패했는데도 화면은 안 죽었다.
`Promise.all` 이었으면 하나만 실패해도 전체 reject 라 완전히 백지였을 것이다.
`allSettled` 라 실패한 도시만 Mock 으로 대체되고 나머지 구조는 그대로 돌았다.

에러 처리를 "혹시 몰라서" 넣는 게 아니라, 실제로 다 터졌을 때 뭐가 남는지가 설계의 차이라는 걸 봤다.

## 크롬 확장 프로그램이 클릭을 먹었다

카드를 눌러도 아무 반응이 없었다. Vue 코드에는 문제가 없었다.
콘솔에 `Grabbit: Linkify enabled. Scanning page...` 가 찍혀 있었다.
확장이 페이지 텍스트를 링크로 바꾸면서 DOM 노드를 갈아치웠고, Vue 가 붙여 둔 이벤트 리스너가 같이 떨어져 나간 것이었다.

**내 코드가 아닌 곳에서도 원인이 나올 수 있다는 걸 처음 겪었다.**
그 뒤로는 "동작이 안 된다" 싶으면 콘솔을 먼저 본다.

## `RouterView` 를 내 손으로 지웠다

교재 68p 를 따라 `App.vue` 를 비우는 과정에서 `<RouterView>` 까지 같이 지웠다.
라우팅이 통째로 죽었는데, 화면이 하나는 떠 있어서 한참 몰랐다.

`RouterView` 는 화면이 갈아 끼워지는 자리다. 그게 없으면 라우터 설정이 아무리 맞아도 아무것도 안 나온다.
교재를 따라 지울 때 뭘 지우는지 보고 지워야 한다는 걸 배웠다.

## 상세 페이지를 직접 열면 Mock 이 떴다

대기오염을 붙이고 확인하는데, 목록에서 카드를 눌러 들어가면 실데이터가 나오고
`/weather/city_01` 을 주소창에 직접 치면 Mock 이 나왔다.

원인은 두 개가 겹쳐 있었다.

1. `loadAllWeather()` 를 목록 화면에서만 부르고 있었다. 상세로 바로 들어오면 아직 안 불린 상태다.
2. 상세 화면이 `onMounted` 에서 도시를 찾아 `ref` 에 **한 번 담고** 있었다.
   나중에 실데이터가 들어와도 `ref` 는 처음 담은 Mock 객체를 계속 붙잡고 있었다.

`ref` 를 `computed` 로 바꿔 스토어를 계속 바라보게 하고, 데이터가 없으면 상세에서도 직접 부르도록 고쳤다.

```js
// 전: onMounted 에서 한 번 찾아 담는다
const city = ref(null)
// 후: 스토어가 바뀌면 다시 계산된다
const city = computed(() => weatherStore.findCity(route.params.cityId))
```

**"한 번 찾아서 담는다" 와 "계속 바라본다" 는 다르다**는 걸 이때 알았다.
computed 를 파생 계산용으로만 생각했는데, 원본이 바뀔 수 있는 값을 참조할 때도 필요했다.

이건 링크를 공유하거나 새로고침했을 때만 보이는 문제라, 목록에서 눌러서만 테스트했으면 못 찾았을 것이다.

## Prettier 가 교재 설명과 다르게 동작했다

교재 271p 미션을 그대로 돌려 봤다.

```
전:  const     myRegion   = `Suwon` ;
후:  const myRegion = `Suwon`
```

공백은 정리됐고 세미콜론도 없어졌다(`semi: false`). 그런데 **백틱은 작은따옴표로 안 바뀌었다.**
교재는 "백틱 기호가 어떻게 자동 변환되었는지 확인한다" 고 되어 있었다.

찾아보니 `singleQuote` 는 **문자열 리터럴**(`''` vs `""`)에만 적용되고 **템플릿 리터럴은 건드리지 않는다.**
`${}` 보간이 들어 있으면 따옴표로 바꾸는 순간 의미가 달라지기 때문에 일부러 손대지 않는 것으로 보인다.

**설정값 이름만 보고 넘겼으면 몰랐을 부분이다.** 직접 돌려 보니 적용 범위가 눈에 보였다.

## 빌드 해시가 실제로 바뀌는 걸 봤다

교재 272p·273p 를 이어서 해봤다.

```
npm run build:staging     → WeatherAboutView-BQafS88U.js  안에 api-stage.skcc.com
npm run build:production  → WeatherAboutView-DyFJYijX.js  안에 api-prod.skcc.com
```

같은 소스, 같은 컴포넌트인데 **파일명 해시가 다르다.**
내용이 바뀌면 이름이 바뀌고, 이름이 바뀌니까 브라우저가 예전 캐시를 못 쓴다.
교재 269p 의 캐시 무효화 설명이 이 두 줄로 눈에 들어왔다.

**같이 알게 된 것이 더 중요했다.**
`import.meta.env.VITE_*` 는 실행할 때 값을 찾아오는 게 아니라 **빌드할 때 글자를 그대로 갈아 끼우는** 방식이다.
그래서 값이 바뀌면 파일 내용이 바뀌고, 해시도 따라 바뀐 것이다.

이 사실은 API 키에도 똑같이 적용된다. 아래에 따로 적었다.

## ESLint 규칙을 직접 걸어 봤다

교재 270p 대로 `eqeqeq: ['error', 'always']` 를 켜고 `if (userAge == 20)` 을 일부러 넣었다.

```
error  Expected '===' and instead saw '=='  eqeqeq
```

교재 253p 에 예시로 나온 메시지와 똑같이 나왔다.

**위치 규칙이 있다는 걸 이때 알았다.** 커스텀 규칙은 `skipFormatting` 바로 위에 둬야 한다.
배열은 아래에 있을수록 위를 덮어쓰기 때문에, 표준 추천 규칙보다 위에 두면 덮여서 아무 효과가 없다.

`no-unused-vars` 는 `warn` 으로 낮췄다. `error` 로 두면 개발 중 임시 변수마다 걸려서 작업이 끊긴다.
`no-console` 은 `off` 로 뒀는데, 실무 배포 단계에서는 반대로 올려서 콘솔 로그가 남은 채 배포되는 걸 막는다고 한다.

---

# API 키를 어떻게 처리했나

`.env.local` 에 두고 `.gitignore` 의 `*.local` 로 막았다. Git 에 올라간 소스에는 키가 없다.

배포는 GitHub Actions 에서 도는데, 거기엔 `.env.local` 이 없다. 그래서 처음엔 **배포본이 Mock 으로 떴다.**
저장소 Secret 에 키를 등록하고 워크플로에서 빌드 시점에만 주입하도록 고쳤다.

```yaml
env:
  VITE_OPENWEATHER_API_KEY: ${{ secrets.VITE_OPENWEATHER_API_KEY }}
```

## 다만 이걸로 완전히 감춰지지는 않는다

위에서 확인한 대로 `import.meta.env` 는 빌드 타임 문자열 치환이다.
**그래서 키는 배포된 JS 번들 안에 문자열로 남는다.** 실제로 빌드 결과물에서 확인했다.

|                 | 키가 있나 |
| --------------- | --------- |
| Git 저장소 소스 | 없음      |
| 배포된 JS 번들  | 있음      |

프론트엔드 전용 앱에서는 구조적으로 막을 수 없다. 근본 해결책은 키를 백엔드에 두고
프론트는 자기 서버만 부르게 하는 프록시 방식이다.

이번 과제는 프론트만 있고 무료 등급 키라 이대로 뒀지만, **모르고 안 한 것과 알고 안 한 것은 다르다고 생각해서**
워크플로 주석과 이 문서에 남긴다.

# 배포

GitHub Actions → GitHub Pages 자동 배포. `main` 에 push 하면 빌드 후 배포된다.

- GitHub Pages 는 하위 경로로 서비스되므로 `base` 를 `/skala-vue/` 로 넘긴다.
  라우터가 `createWebHistory(import.meta.env.BASE_URL)` 를 쓰기 때문에 이 값 하나로 경로가 같이 따라온다.
- 정적 서버라 `/about` 에서 새로고침하면 404 가 난다. `index.html` 을 `404.html` 로 복사해 두면
  Vue Router 가 경로를 이어받는다.

# 프로젝트 구조

```
src/
├── main.js                     createApp → Pinia → Router → Element Plus
├── App.vue                     nav · 단위 토글 · RouterView
├── api/weatherApi.js           axios 인스턴스, 호출 함수
├── data/weatherMockData.js     키 없을 때 쓰는 Mock
├── router/index.js             전 라우트 지연 로딩, 가드
├── stores/                     config · favorite · weather
├── views/                      화면 단위
└── components/handson/         단원별 과제 컴포넌트
```

`/history/*` 아래에 116p·145p·178p 버전을 지우지 않고 남겨 뒀다.
같은 화면이 단계마다 어떻게 달라졌는지 나중에 다시 보려고 남긴 것이다.

# 코드 주석 규칙

나중에 다시 볼 때를 위해 세 가지를 적었다.

1. 교재 몇 페이지 내용인지
2. 왜 그렇게 했는지 (다른 선택지를 안 쓴 이유 포함)
3. 직접 확인한 동작
