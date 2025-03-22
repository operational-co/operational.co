<template>
  <div class="c-crm-item-expanded">
    <div class="c-crm-item-expanded__inner">
      <h3>Details</h3>
      <label> Name </label>
      <span>
        {{ item.name }}
      </span>
      <label> Email </label>
      <span>
        {{ item.email }}
      </span>
      <br />
      <br />
      <h3>Events</h3>
      <EventItem :item="event"></EventItem>
      <EventItem :item="event"></EventItem>
      <EventItem :item="event"></EventItem>
      <EventItem :item="event"></EventItem>
    </div>
  </div>
</template>

<script>
import EventItem from "@/components/events/item.vue";

export default {
  components: {
    EventItem,
  },

  props: {
    item: {},
  },

  data: function () {
    let date = new Date();

    return {
      event: {
        id: 1,
        createdAt: date,
        workspaceId: 1,
        userId: 1,
        avatar: "",
        type: "text",
        name: "User did something",
        actions: null,
        muted: false,
        test: false,
        searchable: "zz",
      },
    };
  },
};
</script>

<style lang="scss">
.c-crm-item-expanded {
  padding-top: var(--margin-lg);

  &__inner {
  }
}
</style>
