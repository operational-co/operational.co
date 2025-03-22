<template>
	<Modal klass="m-permission" :active="active" @onClose="onClose">
		<Permission @onClose="onClose"></Permission>
		<button type="button" @click="onClose" class="btn">Close</button>
	</Modal>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Modal from "@operational.co/components/ui/modal.vue";
import Permission from "./permission.vue";

export default {
	components: {
		Constrain,
		Modal,
		Permission,
	},

	data: function () {
		return {
			currentTab: "login",
		};
	},

	props: {
		active: {
			type: Boolean,
			default: false,
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
.m-permission {
	.vfm__content {
		padding: var(--spacer-sm);
	}

	h3 {
		width: calc(100% - var(--spacer-lg));
	}
}
</style>
