<template>
  <div class="c-page-waitlist">
    <img
      alt="Operational landing page footer"
      srcset="/images/index/intro-footer-bg-vertical.jpg 477w, /images/index/intro-footer-bg.jpg 1000w"
      sizes="(max-width: 1193px) 40vw, 1000px"
    />
    <h2 class="fancy">Sign up for early access</h2>
    <article>
      <p>We are looking for SaaS founders who have felt this pain point.</p>
      <p>In exchange for feedback, we will give you early access + lifetime discounted pricing.</p>
    </article>
    <a
      target="_blank"
      href="https://docs.google.com/forms/d/e/1FAIpQLSf1PsBDQ2wuZdNHqtsAReoYr_vZONBrOMyXNIjSvKP6OUfanA/viewform?usp=sf_link"
      class="btn btn-fancy btn-lg btn-primary"
    >
      <span> Join early access </span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM13.7071 8.29289C13.3166 7.90237 12.6834 7.90237 12.2929 8.29289C11.9024 8.68342 11.9024 9.31658 12.2929 9.70711L13.5858 11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H13.5858L12.2929 14.2929C11.9024 14.6834 11.9024 15.3166 12.2929 15.7071C12.6834 16.0976 13.3166 16.0976 13.7071 15.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929L13.7071 8.29289Z"
          fill="currentColor"
        />
      </svg>
    </a>
  </div>
</template>

<script>
export default {
  components: {}
};
</script>

<style lang="scss">
.c-page-waitlist {
  position: relative;
  padding: calc(var(--spacer-lg) * 5) 0;
  text-align: center;

  &:after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-bg-1);
    opacity: 0.5;
    pointer-events: none;
  }

  article {
    padding: 0 var(--margin-lg);
    position: relative;
    z-index: 1;
    font-size: var(--font-size-lg);
  }

  > img {
    position: absolute;
    z-index: -1;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }

  h3 {
    font-size: var(--font-size-xxxxl);
    font-family: var(--font-family-heading);
    font-weight: 300;

    background: linear-gradient(to bottom, hsl(160, 50%, 97%) 45%, hsl(200, 90%, 79%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    //color: rgba(255, 255, 255, 0.5);
    line-height: 2;

    filter: drop-shadow(0px 2px 4px rgba(35, 8, 22, 0.3));
  }

  p {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  }

  @media screen and (max-width: 800px) {
    //padding: calc(var(--spacer-lg) * 3) 0;
  }

  @media screen and (max-width: 576px) {
    //padding: calc(var(--spacer-lg) * 1) 0;

    h3 {
      line-height: 1.4;
    }

    &:after {
      //content: none;
    }
  }
}
</style>
