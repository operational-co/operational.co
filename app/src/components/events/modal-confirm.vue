<template>
	<Modal klass="modal-confirm" @onClose="active = false" :active="active">
		<article>
			<h3>{{ title }}</h3>
			<div class="modal-confirm__buttons">
				<button
					:disabled="lock === true || (action && action.status === 'DONE')"
					type="button"
					:class="[
						'btn btn-primary',
						{ 'btn-success': action.status && action.status === 'DONE' },
						{ active: activeSlug === action.slug },
					]"
					@click.prevent="onAction(action)"
					:title="action.url"
				>
					<svg
						v-if="action.status && action.status === 'DONE'"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M7 13L10 16L17 8"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>

					<span v-if="activeSlug === action.slug" class="c-spinner"></span>
					<span> Yes </span>
				</button>
				<button type="button" class="btn" @click.prevent="onClose">No</button>
			</div>
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
		};
	},

	props: {
		action: {},
		active: {
			type: Boolean,
			default: true,
		},
	},

	computed: {
		title: function () {
			let str = `Adada`;

			if (this.action) {
				str = this.action.buttonText;
			}

			return str;
		},
	},

	methods: {
		onClose: function () {
			this.$emit("onClose");
		},
		async onAction(action) {
			this.lock = true;
			this.activeSlug = action.slug;

			let res = null;

			try {
				res = await this.$store.events.doAction(action);
			} catch (err) {
				console.log(err);
				let message = "Something went wrong";
				if (typeof err === "string") {
					message = err;
				}
				if (typeof err === "object") {
					message = err;
				}
				this.$store.app.sendNotification({
					message,
				});
			}

			this.lock = false;
			this.activeSlug = null;

			if (res) {
				this.$store.app.sendNotification("Action ran successfully");
			}

			this.onClose();
		},
	},
};
</script>

<style lang="scss">
.modal-confirm {
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
