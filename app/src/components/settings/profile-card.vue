<template>
	<div class="c-settings-profile-card">
		<header>
			<img
				v-if="user && user.avatar"
				class="c-avatar"
				:src="`${assetPath}/${user.avatar}`"
			/>
			<article>
				<p>{{ user.firstName }} {{ user.lastName }}</p>
				<span>{{ user.email }}</span>
			</article>
		</header>
		<footer>
			<section>
				<h5>API Key</h5>
				<Code v-if="apikey" :text="apikey.key"> </Code>
			</section>
			<section>
				<h5>Project</h5>
				<span> {{ workspace.name }} - {{ workspace.status }} </span>
			</section>
			<section>
				<h5>Test mode</h5>
				<label class="c-switch">
					<input v-model="testMode" type="checkbox" checked />
					<span class="c-switch__slider">
						<span class="c-switch__toggle"> </span>
					</span>
				</label>
				<small>
					Use test mode to send test events from local and staging. Test mode
					events will be removed after 7 days.
				</small>
			</section>
		</footer>
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

	data: function () {
		return {
			testMode: false,
		};
	},

	watch: {
		testMode: function () {
			this.onTestMode(this.testMode);
		},
	},

	computed: {
		offline: function () {
			return this.$store.app.offline;
		},
		user: function () {
			return this.$store.user.resource;
		},
		workspace: function () {
			return this.$store.workspace.resource;
		},
		assetPath: function () {
			let baseUrl = "http://localhost:2000";

			if (import.meta && import.meta.env.VITE_API_URL) {
				baseUrl = import.meta.env.VITE_API_URL;
			}
			return `${baseUrl}/uploads`;
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
		apikey: function () {
			if (this.apikeys) {
				return this.apikeys[0];
			}
		},
	},

	methods: {
		async onTestMode(testMode) {
			let condition = "off";
			if (testMode) {
				condition = "on";
			}
			this.$store.app.setTestMode(testMode);
			this.$store.app.sendNotification(`Test mode is ${condition}`);
		},
	},

	mounted: function () {
		this.testMode = this.$store.app.testMode;
	},
};
</script>

<style lang="scss">
.c-settings-profile-card {
	background-color: var(--color-bg-2);
	border-radius: var(--margin-lg);
	margin-bottom: 1rem;

	--img-width: 48px;

	header {
		display: grid;
		grid-template-columns: var(--img-width) 1fr;
		grid-column-gap: var(--margin-lg);
		padding: var(--margin-lg);
		border-bottom: var(--color-bg-3) solid 1px;

		img {
			width: var(--img-width);
			height: var(--img-width);
			display: block;
			border-radius: 99px;
			background-color: var(--color-bg-4);
			object-fit: cover;
			object-position: center center;
		}

		p {
			margin-bottom: 0;
		}

		span {
			opacity: 0.75;
		}
	}

	footer {
		padding: var(--margin-lg);
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: var(--margin-lg);
		grid-row-gap: var(--margin-lg);

		.c-code {
			margin: 0;
			margin-top: 0.5rem;

			pre {
				margin: 0;
				background-color: var(--color-bg-1);
				border-radius: var(--border-radius);
			}
		}

		section {
			> span {
				display: inline-block;
				padding: var(--margin) 0;
			}
		}

		.c-switch {
			display: block;
			margin-top: 0.5rem;
		}
	}

	@media screen and (max-width: 576px) {
		footer {
			grid-template-columns: 1fr;
		}
	}
}
</style>
