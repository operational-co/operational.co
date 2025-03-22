<template>
	<div class="c-settings-usage-item">
		<span></span>
	</div>
</template>

<script>
export default {
	components: {},

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
.c-settings-usage-item {
	padding: var(--margin) 0;

	> span {
		display: block;
		width: 100%;
		height: 8px;
		border-radius: 4px;
		background-color: var(--color-primary);
	}
}
</style>
