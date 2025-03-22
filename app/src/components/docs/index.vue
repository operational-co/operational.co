<template>
	<div class="c-docs">
		<Constrain>
			<header>
				<h3>Operational Docs</h3>
			</header>
			<div class="c-docs__body">
				<h4>Api Key</h4>
				<Code>{{ apikey }}</Code>

				<h4>Code examples</h4>
				<p>All code examples have your api key in them. Just copy and paste!</p>

				<h4>Track events</h4>
				<article>
					<p>Send simple events.</p>
				</article>

				<Track :baseApiUrl="baseApiUrl" :apikey="apikey"></Track>

				<strong>Structured events</strong>

				<article>
					<p>
						Give structure to your events. Pass json, image urls and formatted
						json.
					</p>
				</article>

				<Structured></Structured>
			</div>
		</Constrain>
	</div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Content, {
	frontmatter,
} from "@operational.co/content/manual/introduction.mdx";
import Sidebar from "./sidebar.vue";
import Code from "@operational.co/components/code/index.vue";
import { Tabs, Tab } from "vue3-tabs-component";

import Track from "./track.vue";
import Structured from "./structured.vue";

export default {
	components: {
		Constrain,
		Content,
		Sidebar,
		Code,
		Tabs,
		Tab,

		Track,
		Structured,
	},

	data: function () {
		return {};
	},

	computed: {
		baseUrl: function () {
			return this.$store.app.baseUrl;
		},
		baseApiUrl: function () {
			return this.$store.app.baseApiUrl;
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
				return this.apikeys[0].key;
			}
		},
	},
};
</script>

<style lang="scss">
.c-docs {
	position: relative;
	height: 100%;

	header {
		position: relative;
		display: flex;
		align-items: center;

		h3 {
			//margin-bottom: 0;
		}
	}

	&__menu {
		display: grid;
		grid-template-columns: 1fr 1fr;
		padding: var(--margin);

		&__item {
			padding: var(--margin);
			border-radius: var(--border-radius);
			text-decoration: none !important;
		}
	}

	article {
		color: var(--color-font-light);
	}

	.tabs-component {
		margin-bottom: 1rem;

		ul {
			margin: 0;
			padding: 0;
			list-style: none;
			margin-bottom: 0.5rem;
			border-bottom: var(--color-bg-3) solid 2px;

			li {
				display: inline-block;

				a {
					position: relative;
					display: inline-block;
					padding: var(--margin) var(--margin-lg);
					font-weight: 500;
					font-size: var(--font-size-sm);
					color: var(--color-font);

					&:after {
						content: "";
						position: absolute;
						bottom: -2px;
						left: 0;
						width: 100%;
						height: 2px;
						background-color: var(--color-bg-3);
					}

					&.is-active {
						color: var(--color-primary);

						&:after {
							background-color: var(--color-primary);
						}
					}
				}
			}
		}

		.tabs-component-panels {
			border: var(--color-bg-3) solid 1px;
			border-radius: var(--border-radius);

			.c-code {
				margin: 0;
			}
		}
	}

	@media screen and (max-width: 940px) {
		padding-top: var(--margin-lg);
	}
}
</style>
