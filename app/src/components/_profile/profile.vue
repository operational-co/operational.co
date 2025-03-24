<template>
	<section>
		<Permission></Permission>
	</section>

	<section>
		<h3>API keys</h3>
		<Code v-for="(key, i) in apikeys" :key="i" :copy="true" :text="key.key">
		</Code>
	</section>

	<!-- <section  v-if="showProfile">
				<button class="btn" type="button" @click="openNotifications">
					Permission notifications
				</button>
				<FormSettings></FormSettings>
			</section> -->
	<section>
		<FormUser></FormUser>
		<!-- <FormPassword></FormPassword>
		<FormEmail></FormEmail> -->
		<hr />
		<button
			class="btn btn-danger"
			type="button"
			@click.prevent="$store.user.logout()"
		>
			Logout
		</button>
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
};
</script>

<style lang="scss"></style>
