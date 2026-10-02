<template>
  <Modal klass="modal-view" @onClose="onClose" :active="active">
    <article>
      <header>
        <strong>Event details </strong>
      </header>
      <span v-if="processing" class="c-spinner"></span>
      <Card
        v-if="event"
        :initialExpand="true"
        @onEventNameSearch="onEventNameSearch"
        :item="event"
        @onConfirmAction="onConfirmAction"
        @onCopyPermalink="onCopyPermalink"
      ></Card>

      <footer v-if="showSurrounding">
        <a href="#" class="btn btn-icon" @click.prevent="onShowSurrounding">
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 5C2 4.44772 2.44772 4 3 4H5C5.55228 4 6 4.44772 6 5C6 5.55228 5.55228 6 5 6H3C2.44772 6 2 5.55228 2 5ZM2 5C2 4.44772 2.44772 4 3 4H5C5.55228 4 6 4.44772 6 5C6 5.55228 5.55228 6 5 6H3C2.44772 6 2 5.55228 2 5ZM2 5C2 4.44772 2.44772 4 3 4H5C5.55228 4 6 4.44772 6 5C6 5.55228 5.55228 6 5 6H3C2.44772 6 2 5.55228 2 5ZM2 5C2 4.44772 2.44772 4 3 4H5C5.55228 4 6 4.44772 6 5C6 5.55228 5.55228 6 5 6H3C2.44772 6 2 5.55228 2 5ZM2 5C2 4.44772 2.44772 4 3 4H5C5.55228 4 6 4.44772 6 5C6 5.55228 5.55228 6 5 6H3C2.44772 6 2 5.55228 2 5ZM2 5C2 4.44772 2.44772 4 3 4H5C5.55228 4 6 4.44772 6 5C6 5.55228 5.55228 6 5 6H3C2.44772 6 2 5.55228 2 5ZM2 5C2 4.44772 2.44772 4 3 4H5C5.55228 4 6 4.44772 6 5C6 5.55228 5.55228 6 5 6H3C2.44772 6 2 5.55228 2 5Z"
              fill="currentColor"
            />
            <path
              d="M10 5C10 4.44772 10.4477 4 11 4H13C13.5523 4 14 4.44772 14 5C14 5.55228 13.5523 6 13 6H11C10.4477 6 10 5.55228 10 5Z"
              fill="currentColor"
            />
            <path
              d="M18 5C18 4.44772 18.4477 4 19 4H21C21.5523 4 22 4.44772 22 5C22 5.55228 21.5523 6 21 6H19C18.4477 6 18 5.55228 18 5Z"
              fill="currentColor"
            />
            <path
              d="M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z"
              fill="currentColor"
            />
            <path
              d="M2 19C2 18.4477 2.44772 18 3 18H5C5.55228 18 6 18.4477 6 19C6 19.5523 5.55228 20 5 20H3C2.44772 20 2 19.5523 2 19Z"
              fill="currentColor"
            />
            <path
              d="M10 19C10 18.4477 10.4477 18 11 18H13C13.5523 18 14 18.4477 14 19C14 19.5523 13.5523 20 13 20H11C10.4477 20 10 19.5523 10 19Z"
              fill="currentColor"
            />
            <path
              d="M18 19C18 18.4477 18.4477 18 19 18H21C21.5523 18 22 18.4477 22 19C22 19.5523 21.5523 20 21 20H19C18.4477 20 18 19.5523 18 19Z"
              fill="currentColor"
            />
          </svg>
          <span> View surrounding events </span>
        </a>
      </footer>
    </article>
  </Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";
import Card from "@operational.co/components/card/index.vue";

export default {
  components: {
    Modal,
    Card,
  },

  data: function () {
    return {
      lock: false,
      activeSlug: null,

      processing: false,

      event: null,
    };
  },

  props: {
    action: {},
    active: {
      type: Boolean,
      default: false,
    },
    eventId: {},
  },

  watch: {
    eventId: function () {
      if (!this.eventId) {
        return;
      }

      this.loadEvent(this.eventId);
    },
  },

  computed: {
    showSurrounding: function () {
      if (!this.event) {
        return false;
      }

      return this.event.contextType == null || Number(this.event.contextType) === 0;
    },
  },

  methods: {
    onShowSurrounding: function () {
      this.$emit("onShowSurrounding", this.event.id);
    },
    onCopyPermalink: function () {
      this.$store.app.sendNotification(`Notification's permalink is copied`);
    },
    async loadEvent(eventId) {
      this.processing = true;

      const event = await this.$store.events.findOne({
        id: eventId,
      });

      if (event) {
        this.event = event;
      }

      this.processing = false;
    },
    onEventNameSearch: function () {},
    onConfirmAction: function () {},
    onClose: function () {
      this.$emit("onClose");
    },
  },
};
</script>

<style lang="scss">
.modal-view {
  align-items: stretch;
  justify-content: flex-end;
  padding: 0;

  .c-spinner {
    margin-left: 0;
  }

  article {
    padding: 16px;
  }

  .vfm__content {
    width: 400px;
    height: 100%;
    margin: 0;
    overflow-y: auto;
    border-radius: 0;

    h3 {
      padding-right: 64px;
    }
  }

  &__buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 16px;
  }

  header {
    margin-bottom: 1rem;
  }

  footer {
    margin-top: 1rem;
  }

  @media screen and (max-width: 576px) {
    .vfm__content {
      width: 80%;
    }
  }
}
</style>
