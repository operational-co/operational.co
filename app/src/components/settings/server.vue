<template>
	<section class="c-settings-server">
		<div class="c-settings-server__empty" v-if="!stats">
			<span class="c-spinner"></span>
		</div>
		<template v-else>
			<p>
				Your server is a fancy {{ stats.cpuBrand }}({{ stats.osVersion }})
				running on {{ stats.ram }} with a total disk space of
				{{ stats.totalDiskSpace }}.
			</p>
			<p>{{ stats.availableDiskSpace }} disk space is available.</p>
		</template>
	</section>
</template>

<script>
import FormSettings from "@operational.co/components/form/form-settings.vue";
import FormUser from "@operational.co/components/form/form-user.vue";
import FormPassword from "@operational.co/components/form/form-password.vue";
import FormEmail from "@operational.co/components/form/form-email.vue";
import Permission from "@/components/app/permission.vue";
import Code from "@operational.co/components/code/index.vue";

export default {
	components: {
		FormSettings,
		FormUser,
		FormPassword,
		FormEmail,
		Permission,
		Code,
	},

	data: function () {
		return {
			stats: null,
		};
	},

	computed: {
		workspace: function () {
			return this.$store.workspace.resource;
		},
		apikeys: function () {
			if (!this.workspace) {
				return [];
			}

			if (!this.workspace.keys) {
				return [];
			}

			return this.workspace.keys;
		},
	},

	methods: {
		async getStats() {
			const stats = await this.$store.app.getStats();

			this.stats = stats;
		},
	},

	mounted: function () {
		this.getStats();
	},
};
</script>

<style lang="scss">
.c-settings-server {
	&__empty {
		padding: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	p {
		&:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
