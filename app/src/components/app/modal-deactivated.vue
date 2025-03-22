<template>
	<Modal
		klass="m-deactivated"
		:active="active"
		@onClose="onClose"
		:closeable="closeable"
	>
		<h2>Your account has been deactivated</h2>
		<p>
			Since no payment details have been entered and you have used up all your
			free events, we have deactivated your account.
		</p>
		<p>
			To reactivate your account, enter your credit card details at
			<router-link @click="onClose" to="/settings/billing"
				>app.operational.co/settings/billing</router-link
			>
		</p>
		<router-link @click="onClose" class="btn btn-lg" to="/settings/billing">
			View billing page
		</router-link>
	</Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";
import Docs from "@/components/docs/index.vue";

import { workspaceApi } from "@/store/workspace.js";

export default {
	components: {
		Modal,
		Docs,
	},

	data: function () {
		return {
			code: "",
			closeable: true,
			activated: false,
			error: false,
		};
	},

	props: {
		active: {
			type: Boolean,
			default: false,
		},
	},

	watch: {
		active: function () {
			if (!this.active) {
			}
		},
	},

	methods: {
		onClose: function () {
			this.$emit("onClose");
		},
	},

	mounted: function () {},
};
</script>

<style lang="scss">
.m-deactivated {
	.vfm__content {
		padding: var(--spacer-sm);
	}

	h3 {
		user-select: none;
		width: calc(100% - var(--spacer-lg));
	}

	h2 {
		text-align: center;
	}
}
</style>
