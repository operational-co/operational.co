<template>
  <div class="c-faq">
    <h2>Faqs</h2>
    <p class="article-text-lg">Some questions for</p>
    <section>
      <h3>What are all the components in a url?</h3>
      <article>
        <p></p>
      </article>
    </section>

    <section>
      <h3>How to parse a url in javascript?</h3>
      <article></article>
    </section>

    <section>
      <h3>How to parse a url in php?</h3>
      <article></article>
    </section>

    <section>
      <h3>How to parse a url in python?</h3>
      <article></article>
    </section>

    <section>
      <h3>What is maximum url length?</h3>
      <article>
        <p>2047 Characters</p>
        <p>However, this limit varies by browser to browser. Even CDNs impost a length limit.</p>
        <p>
          If your url is less than 2047, it should be safe and generally work across a wide variety of browsers and not
          cause any breakage.
        </p>
        <p>
          Also, servers can impose a url limit too. If you receive a response code 414, that means your url is too long.
        </p>
      </article>
    </section>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.c-faq {
  border-radius: 5px;
  padding: var(--spacer-sm);
  background-color: var(--color-bg-3);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
</style>
