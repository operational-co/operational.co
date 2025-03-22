<template>
	<div class="c-onboarding-event2">
		<Constrain>
			<article>
				<h3>Actions</h3>
				<template v-if="!item">
				<p>Let's try passing actions in your events.</p>
				<p>
					Paste this bit in your backend codebase and run your code:
					<!-- prettier-ignore -->
					<Code>
<pre>
import Ops from "@operational.co/sdk";
// Or const Ops = require('@operational.co/sdk');

const ops = new Ops("{{ apikey }}");

ops.events.ingest({
	name : 'user signed up',
	actions : [
		{
			url : 'https://api.operational.co/api/demo',
			key : 'ban_user',
			buttonText : 'Ban user'
		},
		{
			url : 'https://api.operational.co/api/demo',
			key : 'ban_user',
			buttonText : 'Ban user'
		}
	]
})</pre>
            </Code>
				</p>
			</template>

				<p v-if="!eventReceived">
					<span class="c-spinner"></span>
					We're listening for this event.
				</p>
				<p v-else>Event received! Onwards and upwards.</p>

				<Card v-if="item" :item="item"></Card>

				<button
					:disabled="!eventReceived"
					class="btn btn-primary"
					@click="$emit('onNext')"
				>
					Next
				</button>
			</article>
		</Constrain>
	</div>
</template>

<script>
import Code from "@operational.co/components/code/index.vue";
import Constrain from "@operational.co/components/ui/constrain.vue";
import Card from "@operational.co/components/card/index.vue";

export default {
	components: {
		Code,
		Constrain,
		Card
	},
	data: function () {
		return {
			item : null,
			counter: null,
			eventReceived: false,
		};
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

	methods: {
		async hasEventBeenReceived(bypass = false) {
			if (bypass) {
				this.eventReceived = true;
				return;
			}
			let events = await this.$store.events.refresh();

			if (events && events.length) {
				let actionEvent = null;
				events.map((e) => {
					if(e.actions) {
						actionEvent = e;
					}
				});
				if(actionEvent) {
				this.eventReceived = true;
				this.item = actionEvent;
				clearInterval(this.counter);
			}
			} else {
				//console.log("counter ran");
			}
		},
		async listen() {
			this.counter = setInterval(() => {
				this.hasEventBeenReceived();
			}, 3000);
		},
	},

	mounted: function () {
		this.listen();
	},

	beforeDestroy: function () {
		clearInterval(this.counter);
	},
};
</script>

<style lang="scss">
.c-onboarding-event2 {
	.c-spinner {
		margin-bottom: -2px;
		border-color: var(--color-primary);
		border-bottom-color: transparent;
	}

	.c-card {
		margin-bottom:var(--spacer-sm);
	}
}
</style>
