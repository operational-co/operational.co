<template>
	<div class="c-settings-token"></div>
</template>

<script>
//import ModalProfileUser from "./modal-profile-user.vue";

export default {
	components: {
		//ModalProfileUser,
	},

	computed: {
		workspace: function () {
			return this.$store.workspace.resource;
		},
		users: function () {
			if (!this.workspace) {
				return [];
			}

			return this.workspace.users || [];
		},
	},
};
</script>

<style lang="scss">
.c-profile-item {
}
</style>
