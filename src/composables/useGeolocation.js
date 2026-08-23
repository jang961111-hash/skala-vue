/**
 * ================================================================
 * useGeolocation.js — 내 위치 가져오기
 * ================================================================
 * ▸ 왜 필요했나
 *   앱을 만들다 보니 구조가 앞뒤가 안 맞는 걸 알았다.
 *   도시 7곳의 촬영 시간을 보여주는데, **사진은 도시 단위로 찍지 않는다.**
 *   지금 내가 서 있는 자리에서 찍는다. 서울 사람에게 부산 골든아워는
 *   정보가 아니다.
 *
 *   골든아워는 위도·경도에 따라 달라진다. 실제로 우리 데이터에서도
 *   부산 19:04, 서울 19:15 로 11분 차이가 난다. 그러니 "내 위치"가
 *   있어야 이 앱이 쓸모가 생긴다.
 *
 * ▸ 왜 자동으로 안 부르나
 *   페이지를 열자마자 위치 권한을 묻는 사이트는 거절당한다.
 *   무엇에 쓰는지 모르는 상태에서 허용할 이유가 없다.
 *   그래서 **버튼을 눌렀을 때만** 요청한다.
 *
 * ▸ HTTPS 가 필요하다
 *   Geolocation 은 보안 컨텍스트에서만 동작한다.
 *   localhost 는 예외로 허용되고, 배포는 GitHub Pages 라 https 다.
 *
 * ▸ 거부당해도 앱은 그대로 돌아간다
 *   권한을 막으면 기존 도시 목록이 남는다. 위치는 있으면 좋은 것이지
 *   없으면 못 쓰는 것이 아니다. (API 키 없을 때 Mock 으로 떨어지는 것과 같은 태도)
 * ================================================================
 */
import { ref } from 'vue'

/** Geolocation 오류 코드를 사람이 읽는 말로 */
const messageOf = (err) => {
  if (!err) return '위치를 가져오지 못했습니다.'
  switch (err.code) {
    case 1:
      return '위치 권한이 거부되었습니다. 주소창 왼쪽 자물쇠에서 허용할 수 있습니다.'
    case 2:
      return '위치를 확인할 수 없습니다. 실내라면 창가에서 다시 시도해 보세요.'
    case 3:
      return '위치 확인이 너무 오래 걸립니다. 잠시 후 다시 시도해 주세요.'
    default:
      return '위치를 가져오지 못했습니다.'
  }
}

export const useGeolocation = () => {
  const coords = ref(null) // { lat, lon, accuracy }
  const isLocating = ref(false)
  const error = ref('')
  const supported = typeof navigator !== 'undefined' && 'geolocation' in navigator

  const locate = () =>
    new Promise((resolve) => {
      if (!supported) {
        error.value = '이 브라우저는 위치 기능을 지원하지 않습니다.'
        resolve(null)
        return
      }
      isLocating.value = true
      error.value = ''

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          coords.value = {
            lat: Number(pos.coords.latitude.toFixed(4)),
            lon: Number(pos.coords.longitude.toFixed(4)),
            // 오차 반경(m). 실내에서는 수백 m 가 나오기도 해서 화면에 같이 보여준다.
            accuracy: Math.round(pos.coords.accuracy),
          }
          isLocating.value = false
          resolve(coords.value)
        },
        (err) => {
          error.value = messageOf(err)
          isLocating.value = false
          console.warn('[useGeolocation]', error.value)
          resolve(null)
        },
        // 사진용이라 미터 단위 정확도가 필요 없다. 빠르고 배터리를 덜 쓰는 쪽으로.
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
      )
    })

  const clear = () => {
    coords.value = null
    error.value = ''
  }

  return { coords, isLocating, error, supported, locate, clear }
}
