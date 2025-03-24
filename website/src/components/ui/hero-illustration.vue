<template>
  <div class="c-hero-illustration">
    <img src="/images/index/product-desktop.webp" />
    <img src="/images/index/product-mobile.webp" />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.c-hero-illustration {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  box-shadow:
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.03) 0px 0px 22.07px 0px;
  border: solid 1px var(--color-bg-5);
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.02);

  box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.02);

  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    border: solid 1px var(--color-bg-2);
    box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.02);

    &:last-child {
      display: none;
      width: 331px;
    }
  }

  @media screen and (max-width: 1020px) {
    margin-top: 1rem;
    width: 100%;
    border-radius: 0;
  }

  @media screen and (max-width: 576px) {
    img {
      border-radius: 18px;
      &:first-child {
        display: none;
      }
      &:last-child {
        display: block;
      }
    }
  }
}
</style>
