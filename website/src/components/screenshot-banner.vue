<template>
  <div :class="['c-screenshot-banner']">
    <article>
      <div>
        <span>Operational</span>
        <h1>{{ title || "" }}</h1>
      </div>
    </article>
    <section>
      <Item :item="item" :initialExpand="true"></Item>
    </section>
  </div>
</template>

<script>
import Item from "@operational.co/components/card/index.vue";

export default {
  components: {
    Item
  },

  data() {
    return {
      title: "",
      cardName: "",
      cardAvatar: "",
      cardType: "",
      cardContent: ""
    };
  },

  computed: {
    item() {
      let date = new Date().toISOString();
      return {
        id: 1,
        createdAt: date,
        name: this.cardName || "Card name",
        avatar: this.cardAvatar || "⏱️",
        type: this.cardType || "default",
        content: this.cardContent
      };
    }
  },

  mounted() {
    this.title = "";
    this.cardName = "User trial ended";
    this.cardAvatar = "🤔";
    this.cardType = "rows";
    this.cardContent = [
      {
        label: "Name",
        content: "Shash"
      },
      {
        label: "Email",
        content: "shash@operational.co"
      }
    ];

    return;
    const params = new URLSearchParams(window.location.search);
    this.title = params.get("title") || "";
    this.cardName = params.get("card-name") || "";
    this.cardAvatar = params.get("card-avatar") || "";
    this.cardType = params.get("card-type") || "";

    const cardContentRaw = params.get("card-content");
    if (cardContentRaw) {
      try {
        this.cardContent = JSON.parse(cardContentRaw);
      } catch (e) {
        this.cardContent = cardContentRaw;
      }
    }
  }
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
    left: 0;
    width: 55%;
    height: 100%;
    padding: 4rem;
    padding-left: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    span {
      display: block;
      margin-bottom: 1rem;
      margin-top: -3.5rem;
      font-size: var(--font-size-xl);
    }

    h1 {
      font-size: 56px;
      margin: 0;
    }
  }

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
    background-image: url("/images/screenshot/gradient.png");
    background-size: cover;
    background-position: center;

    .c-card {
      margin-bottom: 0;
      z-index: 1;
      min-width: 380px;
      box-shadow: 0 0 32px 0 rgba(255, 255, 255, 0.1);
      transform: scale(1.4);
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
