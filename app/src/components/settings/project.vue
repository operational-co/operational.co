<template>
	<div class="c-settings-section c-settings-workspace">
		<DemoWrap>
			<FormProject></FormProject>
		</DemoWrap>
	</div>
</template>

<script>
import FormProject from "@operational.co/components/form/form-project.vue";

import DemoWrap from "@/components/app/demo-wrap.vue";

export default {
	components: {
		FormProject,
		DemoWrap,
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
