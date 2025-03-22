<template>
	<div class="c-onboarding-apikey">
		<Constrain size="xs">
			<article>
				<p>Here's your api key:</p>
				<section>
					<code>{{ apikey }}</code>
					<Copy :text="apikey"></Copy>
				</section>
				<p>Copy this key and save it somewhere secure.</p>

				<button class="btn btn-primary" @click="$emit('onNext')">Next</button>
			</article>
		</Constrain>
	</div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Copy from "@operational.co/components/ui/copy.vue";
export default {
	components: {
		Constrain,
		Copy,
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
	},
};
</script>

<style lang="scss">
.c-onboarding-apikey {
	section {
		margin-bottom: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: var(--color-bg-3);
		padding: var(--margin);
		border-radius: var(--border-radius);

		code {
			margin-bottom: 0;
		}
	}
}
</style>
