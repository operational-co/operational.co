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
      cardContent: "",
      cardActions: [
        {
          key: "ban",
          url: "https://xyz.com/ban",
          buttonText: "Ban user"
        }
      ]
    };
  },

  computed: {
    item() {
      let date = new Date().toISOString();
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const sevenMinutesAgo = new Date(Date.now() - 7 * 60 * 1000).toISOString();
      return {
        id: 1,
        createdAt: date,
        name: "login_failed",
        avatar: "🤔",
        type: "json",
        content: {
          username: "fi32n23i",
          password: "sr3**",
          IP: "127.0.0.1",
          user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:136.0) Gecko/20100101 Firefox/136.0",
          browser: "Firefox",
          os: "Mac OS"
        }
      };
      return {
        id: 1,
        createdAt: date,
        name: this.cardName || "Card name",
        avatar: this.cardAvatar || "⏱️",
        type: this.cardType || "default",
        content: this.cardContent,
        actions: this.cardActions,
        contexts: [
          {
            createdAt: fiveMinutesAgo,
            name: "User activated",
            avatar: "😁"
          },
          {
            createdAt: sevenMinutesAgo,
            name: "User created their project",
            avatar: "👍",
            content: "Project Operational created for user Shash"
          }
        ]
      };
    }
  },

  mounted() {
    this.title = "Track user trial ends";
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
    display: none;

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

    left: 0;
    width: 100%;
    padding-left: 0;

    .c-card {
      max-width: 600px;
      margin-bottom: 0;
      z-index: 1;
      min-width: 380px;
      box-shadow:
        0 0 32px 0 rgba(255, 255, 255, 0.15),
        0 0 128px 0 rgba(255, 255, 255, 0.05);
      transform: scale(1.4);
    }

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, rgba(16, 17, 17, 1) 0%, rgba(16, 17, 17, 0) 30%);
      box-shadow:
        inset 16px 0 128px 16px rgba(16, 17, 17, 0.5),
        inset 0 0 1025px 4px rgba(16, 17, 17, 0.15);
    }

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(-90deg, rgba(16, 17, 17, 1) 0%, rgba(16, 17, 17, 0) 30%);
      box-shadow:
        inset 16px 0 128px 16px rgba(16, 17, 17, 0.5),
        inset 0 0 1025px 4px rgba(16, 17, 17, 0.15);
    }
  }
}
</style>
