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

  computed: {},

  methods: {
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

  @media screen and (max-width: 576px) {
    .vfm__content {
      width: 80%;
    }
  }
}
</style>
