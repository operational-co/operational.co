<template>
	<Modal
		klass="m-create-workspace"
		:active="active"
		@onClose="onClose"
		:closeable="closeable"
	>
		<h2>Create new project</h2>
		<FormCreateWorkspace></FormCreateWorkspace>
	</Modal>
</template>

<script>
import Modal from "@operational.co/components/ui/modal.vue";
import Docs from "@/components/docs/index.vue";
import FormCreateWorkspace from "@operational.co/components/form/form-create-workspace.vue";

import { workspaceApi } from "@/store/workspace.js";

export default {
	components: {
		Modal,
		Docs,
		FormCreateWorkspace,
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
.m-create-workspace {
	.vfm__content {
		padding: var(--spacer-sm);
	}

	h2 {
		display: block;
	}
}
</style>
