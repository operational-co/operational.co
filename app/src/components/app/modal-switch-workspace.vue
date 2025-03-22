<template>
	<Modal
		klass="m-switch-workspace"
		:active="active"
		@onClose="onClose"
		:closeable="closeable"
	>
		<span class="c-spinner"></span>
		<h3>Switching projects...</h3>
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
			closeable: false,
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

	watch: {},

	computed: {
		switchWorkspace: function () {},
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
.m-switch-workspace {
	.vfm__content {
		display: flex;
		align-items: center;
		padding: var(--spacer-sm);
	}

	h3 {
		display: inline-block;
		margin: 0;
		margin-left: var(--margin);
	}
}
</style>
