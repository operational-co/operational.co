<template>
  <section class="c-settings-server">
    <div class="c-settings-server__empty" v-if="!stats">
      <span class="c-spinner"></span>
    </div>
    <template v-else>
      <p>
        Your server is a fancy {{ stats.cpuBrand }}({{ stats.osVersion }}) running on
        {{ stats.ram }} with a total disk space of {{ stats.totalDiskSpace }}.
      </p>
      <p>{{ stats.availableDiskSpace }} disk space is available.</p>
      <table border="1">
        <thead>
          <tr>
            <th>Service</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, i) in stats.services" :key="i">
            <td>{{ service.name }}</td>
            <td>
              <span>
                {{ service.value }}
              </span>
            </td>
            <td>
              <svg
                v-if="service.status === 'inactive'"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="var(--color-danger)"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L12 13.4142L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4142 12L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L12 10.5858L9.70711 8.29289Z"
                  fill="currentColor"
                />
              </svg>
              <svg
                v-if="service.status === 'active'"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="var(--color-success)"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
                  fill="currentColor"
                />
              </svg>

              <small v-if="service.info">({{ service.info }})</small>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </section>
</template>

<script>
import FormSettings from "@operational.co/components/form/form-settings.vue";
import FormUser from "@operational.co/components/form/form-user.vue";
import FormPassword from "@operational.co/components/form/form-password.vue";
import FormEmail from "@operational.co/components/form/form-email.vue";
import Code from "@operational.co/components/code/index.vue";

export default {
  components: {
    FormSettings,
    FormUser,
    FormPassword,
    FormEmail,
    Code,
  },

  data: function () {
    return {
      stats: null,
    };
  },

  computed: {
    workspace: function () {
      return this.$store.workspace.resource;
    },
    apikeys: function () {
      if (!this.workspace) {
        return [];
      }

      if (!this.workspace.keys) {
        return [];
      }

      return this.workspace.keys;
    },
  },

  methods: {
    async getStats() {
      const stats = await this.$store.app.getStats();

      this.stats = stats;
    },
  },

  mounted: function () {
    this.getStats();
  },
};
</script>

<style lang="scss">
.c-settings-server {
  &__empty {
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  p {
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
