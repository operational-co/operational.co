<template>
	<div :class="['c-demo-wrap', { active: isDemo === true }]">
		<div class="c-demo-wrap__inner">
			<slot></slot>
		</div>
		<span v-if="isDemo"> This form isn't available in demo mode. </span>
	</div>
</template>

<script>
export default {
	data: function () {
		return {};
	},

	props: {
		active: {
			default: false,
		},
	},

	watch: {},
	computed: {
		isDemo: function () {
			return this.$store.workspace.isDemo;
		},
	},

	methods: {},
};
</script>

<style lang="scss">
.c-demo-wrap {
	&.active {
		opacity: 0.75;

		.c-demo-wrap__inner {
			pointer-events: none;
			user-select: none;
		}

		> span {
			display: block;
			margin: 0.5rem 0;
			padding: var(--margin-lg);
			border-radius: var(--border-radius);
			color: hsl(var(--hue-orange), 95%, 58%);
			background-color: hsl(var(--hue-orange), 10%, 18%);
		}
	}
}
</style>
