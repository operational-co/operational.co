<template>
  <div class="c-manage-users">
    <section>
      <header>
        <h3>Teammates</h3>
        <a
          v-if="isAdmin(currentUser.id)"
          href="#"
          @click.prevent="onAddTeammate"
          class="btn btn-primary btn-sm btn-icon"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM16 12.9999C16.5523 12.9999 17 12.5522 17 11.9999C17 11.4476 16.5523 10.9999 16 10.9999L13 11V8.00012C13 7.44784 12.5523 7.00012 12 7.00012C11.4477 7.00012 11 7.44784 11 8.00012V11L7.99997 11.0001C7.44769 11.0001 6.99998 11.4479 7 12.0001C7.00002 12.5524 7.44774 13.0001 8.00003 13.0001L11 13V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V13L16 12.9999Z"
              fill="currentColor"
            />
          </svg>

          <span> Invite </span>
        </a>
        <span class="c-spinner" v-if="processing"></span>
      </header>

      <div class="c-manage-users__header">
        <span></span>
        <span>Name </span>
        <span> Email</span>
        <span> Status</span>
        <span> Actions </span>
      </div>

      <div class="c-manage-users__item" v-for="user in computedUsers" :key="user.id">
        <span>
          <Avatar :user="user"></Avatar>
        </span>
        <span>
          <svg
            v-if="isAdmin(user.id)"
            class="admin-badge"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 9C4 4.58172 7.58172 1 12 1C16.4183 1 20 4.58172 20 9C20 11.5264 18.8289 13.7793 17 15.2454V21.4398C17 22.5549 15.8265 23.2801 14.8292 22.7815L12 21.3669L9.17082 22.7815C8.17347 23.2801 7 22.5549 7 21.4398V15.2454C5.17108 13.7793 4 11.5264 4 9ZM9 16.4185V20.6308L11.3292 19.4662C11.7515 19.2551 12.2485 19.2551 12.6708 19.4662L15 20.6308V16.4185C14.0736 16.7935 13.0609 17 12 17C10.9391 17 9.92643 16.7935 9 16.4185Z"
              fill="currentColor"
            />
          </svg>
          {{ user.firstName }} {{ user.lastName }}
        </span>
        <span>
          {{ user.email }}
        </span>
        <span class="label">
          <template v-if="isAdmin(user.id)"> ADMIN </template>
          <template v-else-if="user.status === 'NORMAL'"> MEMBER </template>
          <template v-else>
            {{ user.status }}
          </template>
        </span>
        <div>
          <button
            v-if="!isAdmin(user.id) && isAdmin(currentUser.id)"
            @click.prevent="onRemoveTeammate(user.id)"
            type="button"
            class="btn btn-sm btn-danger"
          >
            Remove
          </button>
        </div>
      </div>
    </section>

    <!-- <section>
      <h3>Invite a member</h3>
      <FormInvite @onSubmit="onSubmit"></FormInvite>
    </section> -->

    <ModalAddTeammate
      :active="modalAddTeammate"
      @onClose="modalAddTeammate = false"
    ></ModalAddTeammate>
    <ModalRemoveTeammate
      :active="modalRemoveTeammate"
      @onClose="
        modalRemoveTeammate = false;
        removeTeammateId = null;
      "
      :userId="removeTeammateId"
    ></ModalRemoveTeammate>
  </div>
</template>

<script>
import Avatar from "@operational.co/components/ui/avatar.vue";
import ModalAddTeammate from "./modal-add-teammate.vue";
import ModalRemoveTeammate from "./modal-remove-teammate.vue";

export default {
  components: {
    Avatar,
    ModalAddTeammate,
    ModalRemoveTeammate,
  },

  data: function () {
    return {
      processing: false,
      modalAddTeammate: false,
      modalRemoveTeammate: false,
      removeTeammateId: null,
    };
  },

  computed: {
    currentUser: function () {
      return this.$store.user.resource;
    },
    workspace: function () {
      return this.$store.workspace.resource;
    },
    users: function () {
      if (!this.workspace) {
        return [];
      }

      let users = this.workspace.users || [];

      return users.slice().reverse();
    },
    computedUsers: function () {
      return this.users;
    },
  },

  methods: {
    isAdmin: function (userId) {
      let workspace = this.workspace;

      if (workspace.adminId === userId) {
        return true;
      }

      return false;
    },
    onAddTeammate: function () {
      this.modalAddTeammate = true;
    },
    onRemoveTeammate: function (userId) {
      this.removeTeammateId = userId;
      this.modalRemoveTeammate = true;
    },
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

  header {
    display: flex;

    h3 {
      display: inline-block;
    }

    .btn {
      margin-left: var(--margin-lg);
    }
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

    > span {
      display: inline-flex;
      align-items: center;
    }

    .admin-badge {
      color: var(--color-primary-light);
      margin-right: var(--margin);
    }

    .label {
      display: inline-flex;
      justify-content: center;
      padding: 0 var(--margin);
      border-radius: var(--border-radius);
      text-align: center;
      font-family: var(--font-family-monospace);
      font-size: var(--font-size-xs);
      font-weight: 500;
      background-color: var(--color-bg-3);
    }
  }

  @media screen and (max-width: 576px) {
    &__header {
      display: none;
    }

    &__item {
      display: grid;
      grid-template-rows: auto auto auto;
      grid-template-columns: 32px 1fr 64px 80px; // total of 4 columns
      column-gap: 8px; // optional
      border-top: none;
      border-bottom: none;

      &:not(:last-of-type) {
        border-bottom: none;
      }

      // 1st row (2 columns: 32px + 1fr)
      & > span:nth-child(1) {
        grid-column: 1; // 32px avatar
        grid-row: 1;
      }
      & > span:nth-child(2) {
        grid-column: 2 / span 3; // full name across rest of the row
        grid-row: 1;
      }

      // 2nd row (3 columns: 1fr 64px 128px)
      & > span:nth-child(3) {
        grid-column: 1 / span 2; // email (1fr)
        grid-row: 2;
      }
      & > span:nth-child(4) {
        grid-column: 3; // role (64px)
        grid-row: 2;
      }
      & > span:nth-child(5) {
        grid-column: 4; // status or other (128px)
        grid-row: 2;
      }

      // 3rd row (optional buttons etc.)
      & > span:nth-child(6) {
        grid-column: 1 / span 4;
        grid-row: 3;
      }
    }
  }
}
</style>
