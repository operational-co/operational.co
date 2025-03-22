<template>
	<Modal klass="m-pwa" :active="active" @onClose="onClose">
		<Pwa></Pwa>
	</Modal>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Modal from "@operational.co/components/ui/modal.vue";
import Pwa from "./pwa.vue";

export default {
	components: {
		Constrain,
		Modal,
		Pwa,
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
.m-pwa {
	.vfm__content {
		padding: var(--spacer-sm);
	}

	h3 {
		width: calc(100% - var(--spacer-lg));
	}
}
</style>
