<template>
  <div class="c-screenshot-banner">
    <article>
      <div>
        <img src="/logo.png" />

        <h1>{{ title || "" }}</h1>
        <p>
          {{ description }}
        </p>
        <span>operational.co/usecases/{{ slug }}</span>
      </div>
    </article>
    <section :style="computedStyle">
      <Item v-if="card" :item="card" :initialExpand="true"></Item>
    </section>
  </div>
</template>

<script>
import Item from "@operational.co/components/card/index.vue";

export default {
  components: {
    Item,
  },

  data() {
    return {
      title: "",
      description: "",
      card: null,
      slug: "",
      bg: "g1",
    };
  },

  computed: {
    computedStyle: function () {
      let path = `/images/screenshot/${this.bg}.jpg`;
      let backgroundImage = `url("${path}")`;
      let style = {
        "background-image": backgroundImage,
      };

      return style;
    },
  },

  mounted() {
    const params = new URLSearchParams(window.location.search);

    this.title = params.get("title") || "Track errors in Nodejs";
    this.description =
      params.get("description") ||
      "This is a guide on tracking errors using Operational.co, a free event tracker";
    this.slug = params.get("slug") || "track-errors-in-nodejs";

    const card = params.get("card") || "";

    this.bg = params.get("bg") || "g1";

    try {
      this.card = JSON.parse(card);
    } catch (err) {
      this.card = {
        name: "URL PARAM ERROR",
      };
    }

    return;
  },
};
</script>

<style lang="scss">
.c-screenshot-banner {
  position: relative;
  height: 100vh;

  article {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 8%;
    width: 45%;
    height: 100%;
    padding-right: 7%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    img {
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
    }

    span {
      display: block;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 50px;
      color: #fff;
    }

    p {
      font-size: var(--font-size-xl);
      line-height: 1.5;
      color: #fff;
    }
  }

  section {
    position: absolute;
    top: 0;
    left: 35%;
    width: 65%;
    height: 100%;
    padding-left: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url("/images/screenshot/g4.jpg");
    background-size: cover;
    background-position: center;

    .c-card {
      margin-bottom: 0;
      z-index: 1;
      width: 420px;
      box-shadow: 0 0 32px 0 rgba(255, 255, 255, 0.1);
      transform: scale(1.2);
    }

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, rgb(20 20 21) 0%, rgba(16, 17, 17, 0) 50%);
      box-shadow:
        inset 16px 0 128px 16px rgb(20 20 21),
        inset 0 0 1025px 4px rgba(16, 17, 17, 0.25);
    }
  }
}
</style>
