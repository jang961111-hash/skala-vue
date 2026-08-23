<!--
  ============================================================
  교재 174p | Default Slot (이름 없는 슬롯) — 자식
  ============================================================
  [props 와의 차이 — 이게 핵심]
    props : 부모가 자식에게 **데이터**를 준다
    slot  : 부모가 자식에게 **마크업(템플릿 조각)**을 준다

  자식이 <slot></slot> 으로 자리를 비워두면,
  부모가 여는/닫는 태그 사이에 넣은 HTML 이 그 자리에 그대로 삽입된다.

  ★ <slot> 안에 적어둔 내용은 **fallback(기본값)**이다.
    부모가 아무것도 안 넣으면 이게 대신 보인다.

  [비유] 자식은 **액자**를 만들어 벽에 걸어둔다.
         부모가 사진을 끼우면 그 사진이 보이고,
         안 끼우면 액자에 인쇄돼 있던 견본 이미지가 보인다.
-->
<template>
  <div class="base-card">
    <slot>
      <p>기본 콘텐츠 영역입니다.</p>
    </slot>
  </div>
</template>

<style scoped>
.base-card {
  margin: 8px 0;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.05);
}
</style>
