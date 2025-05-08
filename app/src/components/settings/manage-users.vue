<template>
  <div class="c-manage-users">
    <!-- <section>
      <h3>Members <span class="c-spinner" v-if="processing"></span></h3>
      <p>Manage project's members</p>

      <div class="c-manage-users__header">
        <span></span>
        <span>Name</span>
        <span> Email</span>
        <span> Type</span>
        <span> Actions </span>
      </div>

      <div class="c-manage-users__item" v-for="user in users" :key="user.id">
        <span>
          <Avatar :user="user"></Avatar>
        </span>
        <span> {{ user.firstName }} {{ user.lastName }} </span>
        <span>
          {{ user.email }}
        </span>
        <span>
          {{ user.status }}
        </span>
        <div>
          <button type="button" class="btn btn-sm btn-danger">Remove</button>
        </div>
      </div>
    </section> -->

    <!-- <section>
      <h3>Invite a member</h3>
      <FormInvite @onSubmit="onSubmit"></FormInvite>
    </section> -->
  </div>
</template>

<script>
import Avatar from "@operational.co/components/ui/avatar.vue";
import FormInvite from "@operational.co/components/form/form-invite.vue";

export default {
  components: {
    Avatar,
    FormInvite,
  },

  data: function () {
    return {
      processing: false,
    };
  },

  computed: {
    workspace: function () {
      return this.$store.workspace.resource;
    },
    users: function () {
      console.log(this.workspace);
      if (!this.workspace) {
        return [];
      }

      return this.workspace.users || [];
    },
  },

  methods: {
    onSubmit: function (users) {
      if (users) {
        this.$store.app.sendNotification({
          message: "User invited",
          timer: 2000,
        });
      }
    },
  },
};
</script>

<style lang="scss">
.c-manage-users {
  section {
    margin-top: 2rem;
  }

  &__header {
    padding: var(--margin) 0;
    display: grid;
    grid-template-columns: 48px 1fr 1fr 80px 100px;
    align-items: center;

    border-bottom: var(--color-bg-5) solid 1px;

    font-size: var(--font-size-xs);
    font-weight: 500;
  }

  &__item {
    padding: var(--margin) 0;
    display: grid;
    grid-template-columns: 48px 1fr 1fr 80px 100px;
    align-items: center;
    font-size: var(--font-size-sm);

    border-top: var(--color-bg-5) solid 1px;

    &:not(:last-of-type) {
      border-bottom: var(--color-bg-5) solid 1px;
    }

    > div {
      margin-left: auto;
    }
  }
}
</style>
