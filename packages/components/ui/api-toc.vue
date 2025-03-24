<template>
  <div class="c-api-toc">
    <h3>Table of contents</h3>
    <ol>
      <li v-for="(item, i) in list" :key="i">
        <a :href="item.path">
          {{ item.title }}
        </a>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      list: [
        {
          title: "Send your first event",
          path: `/api/send-your-first-event`
        },
        {
          title: "Event parameters",
          path: `/api/event-parameters`
        },
        {
          title: "Structured events",
          path: `/api/structured-events`
        },
        {
          title: "Actions",
          path: `/api/actions`
        },
        {
          title: "Contexts",
          path: `/api/contexts`
        },
        {
          title: "Error handling",
          path: `/api/error-handling`
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.c-api-toc {
  ol {
    border-radius: var(--border-radius);
    border: var(--color-bg-4) solid 1px;
    margin: 0;
    padding: 0;
    overflow: hidden;
    li {
      margin: 0;

      &:not(:last-child) {
        border-bottom: var(--color-bg-4) solid 1px;
      }

      a {
        display: block;
        padding: var(--margin-lg);
        background-color: var(--color-bg-2);
        font-weight: 600;
      }
    }
  }
}
</style>
