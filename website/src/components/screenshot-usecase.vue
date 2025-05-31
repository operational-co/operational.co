<template>
  <div class="c-screenshot-usecase">
    <section :style="computedStyle">
      <Item v-if="card" :item="card" :initialExpand="true"></Item>
      <footer>
        <img src="/logo-transparent.png" />
        <span>Operational.co</span>
      </footer>
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
      card: null,
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

    const card = params.get("card") || "";

    this.bg = params.get("bg") || "g1";

    try {
      this.card = JSON.parse(card);
    } catch (err) {
      this.card = {
        name: "URL PARAM ERROR",
      };
    }
  },
};
</script>

<style lang="scss">
.c-screenshot-usecase {
  position: relative;
  height: 100vh;

  section {
    position: absolute;
    top: 0;
    left: 30%;
    width: 70%;
    height: 100%;
    padding-left: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url("/images/screenshot/g1.jpg");
    background-size: cover;
    background-position: center;

    left: 0;
    width: 100%;
    padding-left: 0;

    .c-card {
      width: 460px;
      margin-bottom: 0;
      z-index: 1;
      // box-shadow:
      //   0 0 32px 0 rgba(255, 255, 255, 0.15),
      //   0 0 128px 0 rgba(255, 255, 255, 0.05);
      transform: scale(2);
    }

    footer {
      position: absolute;
      bottom: 2rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 4rem;
        height: 4rem;
      }

      span {
        font-size: var(--font-size-lg);
        font-weight: 500;
      }
    }

    // &:after {
    //   content: "";
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width: 100%;
    //   height: 100%;
    //   background: linear-gradient(90deg, rgba(16, 17, 17, 05) 0%, rgba(16, 17, 17, 0) 30%);
    //   box-shadow:
    //     inset 16px 0 128px 16px rgba(16, 17, 17, 0.25),
    //     inset 0 0 1025px 4px rgba(16, 17, 17, 0.075);
    // }

    // &:before {
    //   content: "";
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width: 100%;
    //   height: 100%;
    //   background: linear-gradient(-90deg, rgba(16, 17, 17, 1) 0%, rgba(16, 17, 17, 0) 30%);
    //   box-shadow:
    //     inset 16px 0 128px 16px rgba(16, 17, 17, 0.5),
    //     inset 0 0 1025px 4px rgba(16, 17, 17, 0.15);
    // }
  }
}
</style>
