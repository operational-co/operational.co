<template>
	<div class="c-calculator">
		<div class="c-calculator__card">
			<VueSlider
				tooltip="always"
				:dotSize="24"
				:height="6"
				:tooltip-formatter="tooltipFormatter"
				:data="pricingSegments"
				:adsorb="true"
				v-model="value"
			/>
		</div>
	</div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
export default {
	components: {
		VueSlider
	},

	data: function () {
		return {
			value: 0,
			min: 0,
			max: 100000,
			intervals: 1000,

			pricingSegments: [0, 1000, 5000, 10000, 50000, 100000, 500000, 1000000]
		};
	},

	watch: {
		value: function () {
			this.$emit("value", this.value);
		}
	},

	props: {},

	computed: {},

	methods: {
		humanizeNumber: function (number) {
			// Convert number to string
			let strNumber = number.toString();

			// Use regex to add commas every three digits
			strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

			return strNumber;
		},
		tooltipFormatter: function (e) {
			let str = `${this.humanizeNumber(e)} events`;

			return str;
		}
	}
};
</script>

<style lang="scss">
.c-calculator {
	.vue-slider {
		.vue-slider-rail {
			background-color: var(--color-bg-5);
		}
		.vue-slider-dot-handle {
			border-color: var(--color-primary);
			border-width: 6px;
		}
		.vue-slider-process {
			background-color: var(--color-primary);
		}
	}
}
</style>
