<template>
	<div class="c-metric-item">
		<p>
			{{ date }}
		</p>
		<span>
			{{ humanizeNumber(metric.events) }}
		</span>
	</div>
</template>

<script>
import moment from "moment";
import humanizeNumber from "@/lib/humanize-number.js";

export default {
	components: {},

	props: {
		metric: {},
	},

	computed: {
		date: function () {
			let metric = this.metric;

			let date = moment();
			date.set({
				year: metric.year,
				month: metric.month,
				date: 0,
				hour: 0,
				minute: 0,
				second: 0,
				millisecond: 0,
			});

			return date.format("MMMM YYYY");
		},
	},

	methods: {
		humanizeNumber: function (num) {
			return humanizeNumber(num);
		},
	},
};
</script>

<style lang="scss">
.c-metric-item {
	padding: var(--margin-lg);
	background-color: var(--color-bg-3);
	border-radius: var(--border-radius);

	p {
		margin-bottom: 0;
		font-size: var(--font-size-sm);
		font-weight: 500;
		opacity: 0.85;
	}

	span {
		display: block;
		font-weight: 300;
		font-size: var(--font-size-lg);
		font-feature-settings: "tnum";
	}
}
</style>
