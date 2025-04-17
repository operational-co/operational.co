<template>
	<Modal klass="modal-view" @onClose="active = false" :active="active">
		<article>
			<span v-if="processing" class="c-spinner"></span>
		</article>
	</Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";

export default {
	components: {
		Modal,
	},

	data: function () {
		return {
			lock: false,
			activeSlug: null,

			processing: false,
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
			console.log(this.eventId);
			this.loadEvent(this.eventId);
		},
	},

	computed: {},

	methods: {
		async loadEvent(eventId) {
			this.processing = true;

			//this.processing = false;
		},
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

	@media screen and (max-width: 460px) {
		.vfm__content {
			width: calc(100% - 48px);
		}
	}
}
</style>
