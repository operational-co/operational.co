<template>
	<router-link
		to="/settings/billing"
		:class="['c-blurb', { danger: currentEvents >= freeEvents }]"
	>
		<div class="c-blurb__inner">
			<strong>
				{{ humanizeNumber(currentEvents) }} /
				{{ humanizeNumber(freeEvents) }} free events remaining
			</strong>
		</div>
	</router-link>
</template>

<script>
export default {
	data: function () {
		return {
			freeEvents: 10000,
		};
	},

	watch: {},
	computed: {
		metrics: function () {
			return this.$store.metric.resources;
		},
		currentMetric: function () {
			if (!this.metrics) {
				return null;
			}
			return this.metrics[0];
		},
		currentEvents: function () {
			if (!this.currentMetric) {
				return 0;
			}
			return this.currentMetric.events;
		},
	},

	methods: {
		humanizeNumber: function (number) {
			// Convert number to string
			let strNumber = number.toString();

			// Use regex to add commas every three digits
			strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

			return strNumber;
		},
	},
};
</script>

<style lang="scss">
.c-blurb {
	position: fixed;
	z-index: 1;
	bottom: 1rem;
	left: 1rem;

	width: 290px;

	border-radius: var(--border-radius);
	background-color: hsl(var(--hue-p), 50%, 10%);
	border: 0.5px solid rgba(92, 99, 112, 0.4);
	border-top-color: rgba(92, 99, 112, 0.55);

	text-decoration: none;
	cursor: pointer;

	box-shadow:
		rgba(0, 0, 0, 0) 0px 0px 0px 0px,
		rgba(0, 0, 0, 0) 0px 0px 0px 0px,
		rgba(0, 0, 0, 0.04) 0px 1px 3px -1px,
		rgba(0, 0, 0, 0.04) 0px 1px 4px -1px;

	&__inner {
		padding: var(--margin-lg);
		font-size: var(--font-size-sm);
	}

	strong {
		font-weight: 500;
		color: hsl(var(--hue-p), 92%, 53%);
	}

	&:hover,
	&:active {
		filter: brightness(125%);
	}

	&.danger {
		background-color: hsl(var(--hue-red), 50%, 10%);
		strong {
			color: hsl(var(--hue-red), 92%, 53%);
		}
	}

	@media screen and (max-width: 940px) {
		display: none;
	}
}
</style>
