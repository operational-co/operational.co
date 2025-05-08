<template>
  <div class="c-onboarding-pwa">
    <Constrain size="sm">
      <article>
        <h3>Set up Operational on your phone</h3>

        <p>
          Operational works as a native app once you "install" it.<br />
          You will also receive push notifications directly on your phone!
        </p>

        <div class="c-onboarding-pwa__grid">
          <article>
            <strong
              >Step 1. Open <a :href="baseUrl" target="_blank">{{ host }}</a> in Safari & click on
              the "Share" button</strong
            >
            <img src="/images/pwa1.webp" />
          </article>
          <article>
            <strong>Step 3. Click on "Add to Home Screen"</strong>
            <img src="/images/pwa2.webp" />
          </article>
          <article>
            <strong>Step 4. Click on "Add"</strong>
            <img src="/images/pwa3.webp" />
          </article>
        </div>

        <button class="btn btn-primary" @click="$emit('onNext')">Next</button>

        <!-- <FormStats @onSubmit="onSubmit"></FormStats> -->
      </article>
      <section></section>
    </Constrain>
  </div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import FormStats from "@operational.co/components/form/form-stats.vue";
export default {
  components: {
    Constrain,
    FormStats,
  },

  data: function () {
    return {
      placeholder: "Project name",
      projectName: "",
    };
  },

  computed: {
    baseUrl: function () {
      let url = new URL(window.location.href);

      return `${url.origin}`;
    },
    host: function () {
      let url = new URL(window.location.href);

      return `${url.host}`;
    },
  },

  methods: {
    onSubmit: function () {
      this.$emit("onNext");
    },
  },
};
</script>

<style lang="scss">
.c-onboarding-pwa {
  .btn {
    &.btn-wide {
      width: auto;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
    margin-bottom: 1rem;

    strong {
      display: block;
      margin-bottom: 0.5rem;
    }

    article {
      padding: 1rem;
      background-color: var(--color-bg-2);
      border-radius: var(--border-radius);
    }

    img {
      border-radius: var(--border-radius-sm);
    }
  }
}
</style>
