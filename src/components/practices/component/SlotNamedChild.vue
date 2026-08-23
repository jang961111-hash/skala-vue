<!--
  ============================================================
  교재 175p | Named Slot (이름 있는 슬롯) — 자식
  ============================================================
  [왜 필요한가] slot 을 **여러 개** 두려면 구분할 이름이 있어야 한다.
                이름이 없으면 부모가 넣은 콘텐츠를 어느 자리에 넣을지 알 수 없다.

    <slot name="header"></slot>   ← 이름 있는 슬롯
    <slot></slot>                 ← 이름 없는 것은 default 슬롯으로 남는다

  [실무 활용] 레이아웃 / 모달 팝업처럼 **헤더·본문·푸터** 영역을
             부모가 각각 다른 콘텐츠로 채우게 할 때 쓴다.

  [비유] 자식이 **서랍장**을 만들어 서랍마다 이름표를 붙여둔 것.
         부모는 "header 서랍에 이걸 넣어줘" 라고 지정해서 넣는다.
-->
<template>
  <div class="base-card">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.base-card {
  margin: 8px 0;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}
.base-card header {
  padding: 10px 16px;
  background: rgba(99, 102, 241, 0.12);
  border-bottom: 1px solid var(--color-border);
}
.base-card main {
  padding: 14px 16px;
}
</style>
