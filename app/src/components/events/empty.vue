<template>
	<section class="c-events-empty">
		<div class="c-events-empty__loader" v-if="!loaded">
			<span class="c-spinner"></span>
		</div>
		<div class="c-events-empty__inner" v-if="loaded && items.length === 0">
			<template v-if="!testMode">
				<p>
					👋 Hello {{ user.firstName
					}}<template v-if="user.lastName">&nbsp;{{ user.lastName }}</template
					>, looks like you haven't sent any events. Let's get your first event
					logged!
				</p>
				<p>
					Sending an event to Operational is easy - just pick your preferred
					method below and run the snippet:
				</p>
			</template>
			<template v-else>
				<p>
					Hello {{ user.firstName }}. Test mode is on - you will only see test
					events here.
				</p>
				<p>
					You can switch off test mode by going into
					<router-link to="/settings">settings</router-link> and turning the
					test mode toggle off.
				</p>
			</template>

			<Accordion>
				<template #title
					><svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6.88926 4.21041C5.53867 3.53708 4 4.5445 4 6.01567V17.9785C4 19.4496 5.53867 20.4571 6.88926 19.7837L18.887 13.8023C20.371 13.0625 20.371 10.9317 18.887 10.1918L6.88926 4.21041Z"
							fill="currentColor"
						/>
					</svg>
					<p>Nodejs SDK</p>
				</template>
				<template #body>
					<br />
					<p>Install the Operational SDK</p>
					<Code>
						<pre>npm install --save @operational.co/sdk</pre>
					</Code>
					<p>Add this code inside your nodejs project.</p>
					<Code>
						<pre>
import Ops from "@operational.co/sdk";
// Or if you're using require
// const Ops = require('@operational.co/sdk');

const ops = new Ops("{{ apikey }}");

ops.events.ingest({
  name : 'User signed up',
});</pre
						>
					</Code>
				</template>
			</Accordion>
			<Accordion>
				<template #title
					><svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6.88926 4.21041C5.53867 3.53708 4 4.5445 4 6.01567V17.9785C4 19.4496 5.53867 20.4571 6.88926 19.7837L18.887 13.8023C20.371 13.0625 20.371 10.9317 18.887 10.1918L6.88926 4.21041Z"
							fill="currentColor"
						/>
					</svg>
					<p>Axios(javascript)</p>
				</template>
				<template #body>
					<Code>
						<pre>
axios.post('https://api.operational.co/api/v1/ingest',{
name : 'User signed up',
}, {
headers : {
'Authorization' : 'Bearer {{ apikey }}'
}
});</pre
						>
					</Code>
				</template>
			</Accordion>
			<Accordion>
				<template #title
					><svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6.88926 4.21041C5.53867 3.53708 4 4.5445 4 6.01567V17.9785C4 19.4496 5.53867 20.4571 6.88926 19.7837L18.887 13.8023C20.371 13.0625 20.371 10.9317 18.887 10.1918L6.88926 4.21041Z"
							fill="currentColor"
						/>
					</svg>
					<p>Fetch(javascript)</p>
				</template>
				<template #body>
					<Code>
						<pre>
const url = `https://api.operational.co/api/v1/log`;

const response = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer {{ apikey }}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "User signed up"
  })
});

const data = await response.json();
console.log(data);
</pre
						>
					</Code>
				</template>
			</Accordion>
			<Accordion>
				<template #title
					><svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6.88926 4.21041C5.53867 3.53708 4 4.5445 4 6.01567V17.9785C4 19.4496 5.53867 20.4571 6.88926 19.7837L18.887 13.8023C20.371 13.0625 20.371 10.9317 18.887 10.1918L6.88926 4.21041Z"
							fill="currentColor"
						/>
					</svg>
					<p>cURL</p>
				</template>
				<template #body>
					<Code>
						<pre>
	curl -X POST "https://api.operational.co/api/v1/log" -H "Authorization: Bearer {{
								apikey
							}}" -H "Content-Type: text/plain" -d "test msg"
</pre
						>
					</Code>
				</template>
			</Accordion>

			<p>
				If you run into any snags, don't hesitate to reach out to me via the
				in-app chat widget.
			</p>
			<blockquote>
				<img src="/shash.jpg" />
				<span> Shash, Operational's founder </span>
			</blockquote>
		</div>
	</section>
</template>

<script>
import Code from "@operational.co/components/code/index.vue";
import Accordion from "@operational.co/components/ui/accordion.vue";

export default {
	components: {
		Code,
		Accordion,
	},

	props: {
		items: {},
		query: {},
		computedItems: {},
		loaded: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		testMode: function () {
			return this.$store.app.testMode;
		},
		workspace: function () {
			return this.$store.workspace.resource;
		},
		user: function () {
			return this.$store.user.resource;
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
		show: function () {
			if (!this.computedItems.length) {
				return true;
			}

			return false;
		},
	},

	methods: {
		onClear: function () {
			this.$emit("onClear");
		},
	},
};
</script>

<style lang="scss">
.c-events-empty {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	margin-top: 1rem;

	&__inner {
		margin-top: var(--spacer-sm);
		padding: var(--spacer);

		background-color: var(--color-bg-2);
		border-radius: var(--border-radius-lg);
	}

	pre {
		padding: 0;
	}

	&__loader {
		padding: var(--spacer) var(--spacer-lg);
	}

	.c-accordion {
		border: none;

		&__title {
			padding: 0;
			display: flex;

			align-items: center;

			svg {
				display: inline-block;
				margin-right: 0.5rem;
				widrh: 16px;
				height: 16px;
			}

			p {
				margin-bottom: 0;
			}
		}

		&__body {
			padding: 0;

			[class*="shj-lang-"] {
				padding: 0.5rem;
				background-color: rgba(0, 0, 0, 0.1);
				border-radius: var(--border-radius-sm);
			}
		}

		&.active {
			.c-accordion__title {
				svg {
					transform: rotate(90deg);
				}
			}
		}
	}

	blockquote {
		padding: 0;

		display: grid;
		grid-template-columns: 48px 1fr;
		grid-column-gap: var(--margin-lg);
		align-items: center;

		img {
			width: 48px;
			height: 48px;
			display: inline-block;
			object-fit: cover;
			object-position: center center;
			border-radius: 99px;
		}

		span {
			font-size: var(--font-size-sm);
			font-weight: 500;
		}
	}

	@media screen and (max-width: 576px) {
		width: 100%;

		&__loader {
			padding: var(--margin) var(--margin-lg);
		}

		&__inner {
			width: 100%;
			overflow-x: hidden;
			padding: var(--margin-lg);
		}
	}
}
</style>
