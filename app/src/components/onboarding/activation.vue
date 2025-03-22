<template>
	<div class="c-onboarding-activation">
		<Constrain size="sm">
			<article>
				<h3>Verify your email</h3>
				<p v-if="!checking">
					We sent you a email at {{ email }} with a unique link.<br />
					Click on that link to verify your email and activate your account.
				</p>
				<span v-if="checking" class="c-spinner"></span>
			</article>
		</Constrain>
	</div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import { workspaceApi } from "@/store/workspace.js";

export default {
	components: {
		Constrain,
	},

	computed: {
		workspace: function () {
			return this.$store.workspace.resource;
		},
		apikey: function () {
			let workspace = this.workspace;
			if (!workspace) {
				return "";
			}

			let apikeys = workspace.keys;
			if (!apikeys) {
				return "";
			}
			let key = apikeys[0].key;
			return key;
		},
		user: function () {
			return this.$store.user.resource;
		},
		email: function () {
			return this.user.email;
		},
	},

	methods: {
		async checkActivationCode() {
			let route = this.$route;
			if (!route.query) {
				return;
			}

			if (!route.query.code) {
				return;
			}

			let code = route.query.code;

			this.checking = true;

			let form = {
				code: code,
			};

			let res = null;

			try {
				res = await workspaceApi.activate(form);

				console.log(res);

				this.$store.app.sendNotification("Your account has been activated!");

				this.$emit("onNext");
			} catch (err) {
				console.log(err);
			}
			this.checking = false;
		},
	},

	mounted: function () {
		setTimeout(() => {
			this.checkActivationCode();
		}, 50);
	},
};
</script>

<style></style>
