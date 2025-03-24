<template>
	<div class="c-profile">
		<Constrain>
			<Profile v-if="$route.path === '/profile'"></Profile>

			<router-view></router-view>
		</Constrain>
	</div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Profile from "./profile.vue";
import Workspace from "./workspace.vue";

export default {
	components: {
		Constrain,
		Profile,
		Workspace,
	},

	data: function () {
		return {
			stripe: null,
			elements: null,
			paymentElement: null,
			addressElement: null,
		};
	},

	computed: {},

	methods: {
		openNotifications: function () {},
	},

	mounted: function () {},
};
</script>

<style lang="scss">
.c-profile {
	nav {
		margin-top: var(--margin-lg);
		margin-bottom: var(--margin-lg);
		border-radius: var(--input-radius);

		a {
			position: relative;
			font-weight: 500;

			&:not(:last-child) {
				&:after {
					content: "/";
					color: var(--color-font);
					pointer-events: none;
				}
			}
		}
	}

	#address-element {
		margin-bottom: var(--margin);
	}

	h3 {
		margin: 0;
	}

	.c-constrain__inner > section {
		margin-top: var(--margin-lg);
		padding: var(--spacer);
		background-color: var(--color-bg-3);
		border-radius: 20px;

		p {
			> a {
				color: var(--color-font);
				text-decoration: underline;
			}
		}

		h3 {
		}

		[class^="f-"]:not(:last-child) {
			margin-bottom: var(--spacer);
		}
	}

	@media screen and (max-width: 1120px) {
		padding-top: var(--margin-lg);

		.c-constrain__inner > section {
			padding: var(--spacer-sm);
		}
	}
}
</style>
