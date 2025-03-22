<template>
	<div class="c-app-test-mode">
		<span> Test mode </span>
		<label class="c-switch">
			<input v-model="testMode" type="checkbox" checked />
			<span class="c-switch__slider">
				<span class="c-switch__toggle"> </span>
			</span>
		</label>
	</div>
</template>

<script>
export default {
	data: function () {
		return {
			testMode: true,
		};
	},

	watch: {
		testMode: function () {
			this.$store.app.setTestMode(this.testMode);
		},
	},

	mounted: function () {
		this.testMode = this.$store.app.testMode;
	},
};
</script>

<style lang="scss">
.c-app-test-mode {
	position: absolute;
	top: var(--margin);
	right: var(--margin);
	width: auto;
	height: auto;
	padding: var(--margin-sm) var(--margin-lg);
	font-size: var(--font-size-xs);
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	color: var(--color-warning);
	border-radius: var(--border-radius);
	background-color: var(--color-bg-2);

	.c-switch {
		width: 40px;
		height: 20px;

		&__toggle {
			left: 2px;
			bottom: 2px;
			width: 16px;
			height: 16px;
		}

		input:checked + .c-switch__slider {
			background-color: var(--color-warning);

			.c-switch__toggle {
				transform: translateX(20px);
			}
		}
	}

	@media screen and (max-width: 576px) {
		top: 18px;
		right: var(--margin-lg);
	}
}
</style>
