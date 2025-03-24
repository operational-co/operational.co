<template>
	<div :class="['c-glow', { active: active === true }]">
		<svg width="100%" height="100%">
			<pattern
				id="pattern-circles"
				x="0"
				y="0"
				width="20"
				height="20"
				patternUnits="userSpaceOnUse"
				patternContentUnits="userSpaceOnUse"
			>
				<circle
					id="pattern-circle"
					cx="10"
					cy="10"
					r="1.6257413380501518"
					fill="currentColor"
				></circle>
			</pattern>

			<rect
				id="rect"
				x="0"
				y="0"
				width="100%"
				height="100%"
				fill="url(#pattern-circles)"
			></rect>
		</svg>
	</div>
</template>

<script>
export default {
	data: function () {
		return {
			active: false,
		};
	},

	watch: {
		appInit: {
			handler: function () {
				if (this.appInit) {
					this.$nextTick(() => {
						this.active = true;
					});
				} else {
					this.active = false;
				}
			},
			immediate: true,
		},
	},
	computed: {
		appInit: function () {
			let condition = this.$store.app.appInit;
			return condition;
		},
	},
};
</script>

<style lang="scss">
.c-glow {
	//background-color: red;
	width: 100%;
	height: 300px;
	position: absolute;
	top: 0;
	left: 0; //calc(50% - 1000px);
	//z-index: 99;
	//z-index: -1;
	//overflow: hidden;
	//color: var(--color-bg-5);

	&:after {
		//background-color: #f30;
		// background: radial-gradient(
		// 	closest-side at 50% 50%,
		// 	hsla(210, 56%, 22%, 1) 0,
		// 	hsla(0, 25%, 67%, 0)
		// );

		// border-radius: 999px;
		// content: "";
		// width: 100%;
		// height: 100%;

		// pointer-events: none;
		// position: absolute;
		// top: 0;
		// left: 0;
		// transform: translateY(calc(-50% - 100px));
		// opacity: 0.5;
		// transition: all 1000ms linear 250ms;

		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 250px;
		background: linear-gradient(
			0deg,
			hsl(var(--hue-p), 3%, 6.5%) 0%,
			hsla(var(--hue-p), 3%, 6.5%, 0.1) 100%
		);
	}

	svg {
		color: rgba(255, 255, 255, 0.15);
	}

	// &.active {
	// 	&:after {
	// 		transform: translateY(calc(-50% - 50px));
	// 		opacity: 1;
	// 	}
	// }

	@media screen and (max-width: 576px) {
		&:after {
			left: -200px;
			width: calc(100% + 400px);
		}
	}
}
</style>
