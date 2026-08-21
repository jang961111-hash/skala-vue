/**
 * ================================================================
 * 교재 196p 요구사항 4 | Mock Data
 * ================================================================
 * ▸ 왜 별도 파일로 뺐나
 *   목록 화면(WeatherHomeView)과 상세 화면(WeatherDetailView)이
 *   같은 데이터를 봐야 한다. 라우터로 페이지가 갈리면 컴포넌트가
 *   서로 부모-자식이 아니게 되므로 props 로 넘길 수 없다.
 *
 *   → 지금 단계에서는 공용 모듈로 import 해서 쓴다.
 *   → 다음 단원(Pinia, 198p)에서 이 자리를 스토어가 대체한다.
 *     그때 "왜 스토어가 필요한가"의 답이 바로 이 파일이다.
 *
 * ▸ 각 도시에 상세 페이지용 관측 정보(observation)를 추가했다.
 *   목록에서는 안 보이고 상세에서만 쓰인다.
 * ================================================================
 */
export const weatherMockData = [
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 62,
    wind: 2.4,
    feelsLike: 31,
    observation: { station: 'SEL', pressure: 1008, visibility: 12, uv: 7, dust: '보통' },
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 88,
    wind: 3.1,
    feelsLike: 26,
    observation: { station: 'SWN', pressure: 1004, visibility: 6, uv: 2, dust: '좋음' },
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 74,
    wind: 4.8,
    feelsLike: 28,
    observation: { station: 'PUS', pressure: 1010, visibility: 9, uv: 5, dust: '보통' },
  },
  {
    id: 'city_04',
    name: '강릉',
    temp: 22,
    status: '비',
    humidity: 91,
    wind: 5.2,
    feelsLike: 23,
    observation: { station: 'KAG', pressure: 1002, visibility: 4, uv: 1, dust: '좋음' },
  },
  {
    id: 'city_05',
    name: '제주',
    temp: 29,
    status: '맑음',
    humidity: 70,
    wind: 6.0,
    feelsLike: 33,
    observation: { station: 'CJU', pressure: 1012, visibility: 15, uv: 9, dust: '좋음' },
  },
  {
    id: 'city_06',
    name: '대전',
    temp: 25,
    status: '구름',
    humidity: 66,
    wind: 1.9,
    feelsLike: 27,
    observation: { station: 'TJN', pressure: 1007, visibility: 10, uv: 4, dust: '나쁨' },
  },
]

/** 도시 ID 로 하나를 찾는다. 없으면 undefined — 상세 화면에서 "없는 도시" 처리에 쓴다. */
export const findCityById = (cityId) => weatherMockData.find((c) => c.id === cityId)
