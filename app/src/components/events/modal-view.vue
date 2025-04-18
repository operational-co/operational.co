<template>
	<Modal klass="modal-view" @onClose="onClose" :active="active">
		<article>
			<header>
				<strong>Event details </strong>
			</header>
			<span v-if="processing" class="c-spinner"></span>
			<Card
				v-if="event"
				@onEventNameSearch="onEventNameSearch"
				:item="event"
				@onConfirmAction="onConfirmAction"
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
	.c-spinner {
		margin-left: 0;
	}

	article {
		padding: 16px;
	}

	.vfm__content {
		width: 420px;

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

	@media screen and (max-width: 460px) {
		.vfm__content {
			//width: calc(100% - 48px);
		}
	}
}
</style>
