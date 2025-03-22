<template>
	<div class="c-onboarding-intro">
		<Constrain size="sm">
			<article>
				<h3>Welcome!</h3>
				<p>👋 Hi {{ user.firstName }}, welcome to Operational!</p>
				<p>Please copy your apikey and save it somewhere private.</p>
				<Code>
					<pre>{{ apikey }}</pre>
				</Code>
				<button class="btn btn-primary" @click="$emit('onNext')">Gotcha</button>
			</article>
		</Constrain>
	</div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Code from "@operational.co/components/code/index.vue";

export default {
	components: {
		Constrain,
		Code,
	},

	computed: {
		user: function () {
			return this.$store.user.resource;
		},
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
	},
};
</script>

<style></style>
