/**
 * ================================================================
 * 교재 212p 요구사항 4 | favoriteStore — 본인 추가 Store
 * ================================================================
 * ▸ 왜 이 스토어를 골랐나
 *     "스토어를 쓰면 무엇이 좋아지는가"를 가장 분명하게 보여주기 때문이다.
 *
 *     컴포넌트의 ref 에 즐겨찾기를 담으면,
 *     상세 페이지로 이동하는 순간 그 컴포넌트가 **언마운트되면서 값이 사라진다.**
 *     (교재 152p 라이프사이클 — Unmounting)
 *
 *     스토어는 컴포넌트 바깥에 살기 때문에 페이지를 옮겨도 유지된다.
 *     → 목록에서 별을 누르고 → 상세로 갔다가 → 돌아와도 그대로 있다.
 *
 * ▸ 배열 state 를 다룰 때 주의
 *     ref([]) 로 만든 배열은 push / splice 로 조작한다.
 *     favoriteIds.value = [...] 재할당도 ref 라면 안전하지만,
 *     여기서는 의도를 분명히 하기 위해 push/splice 를 쓴다. (교재 123p)
 * ================================================================
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFavoriteStore = defineStore('favorite', () => {
  /* ── state ── */
  const favoriteIds = ref([])

  /* ── getters ── */
  const favoriteCount = computed(() => favoriteIds.value.length)
  const hasFavorite = computed(() => favoriteIds.value.length > 0)

  /* ── actions ── */
  const isFavorite = (cityId) => favoriteIds.value.includes(cityId)

  const toggleFavorite = (cityId) => {
    const idx = favoriteIds.value.indexOf(cityId)
    if (idx === -1) {
      favoriteIds.value.push(cityId)
    } else {
      favoriteIds.value.splice(idx, 1)
    }
    console.log(`[favoriteStore] 즐겨찾기 ${favoriteIds.value.length}개: [${favoriteIds.value}]`)
  }

  const clearAll = () => {
    favoriteIds.value.splice(0, favoriteIds.value.length)
  }

  return { favoriteIds, favoriteCount, hasFavorite, isFavorite, toggleFavorite, clearAll }
})
