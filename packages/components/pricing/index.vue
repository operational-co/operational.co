<template>
	<div class="c-pricing">
		<div class="c-pricing__card">
			<blockquote>
				<strong> Heads up - Operational is free during beta </strong>
				<p>You won't be charged during the beta period. We'll notify you before going live and enabling payments.</p>
			</blockquote>
			<header>
				<h3>One pricing</h3>
				<p>Our simple, usage-based pricing means you only pay for what you use.</p>
				<p>No extra charges, no minimum charge, volume discount baked in.</p>
			</header>
			<section>
				<h4>Calculate pricing</h4>
				<Calculator @value="onValue"></Calculator>
				<h5>You pay:</h5>
				<h3 class="h2">
					${{ parseInt(cost.cost) }}
					<span>/ month</span>
				</h3>
				<h5>Breakdown:</h5>
				<div v-for="(data, i) in cost.eventsCount" :key="i">
					<span> {{ data.count }} events x ${{ data.rate }} per event </span>
				</div>

				<hr />

				<h3>Estimates</h3>
				<ul>
					<li>
						<p>
							A SaaS business signing up ~30 users per month will generate around <strong>~20,000 events</strong> per
							month
						</p>
					</li>
					<li>
						<p>
							Simple tasks such as cronjob monitoring, IoT notifications, etc will generate
							<strong>500 - 1000 events</strong> per month.
						</p>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<script>
import Calculator from "./calculator.vue";

import generateCost from "@operational.co/lib/generate-cost.js";
import prices from "@operational.co/lib/prices.js";

export default {
	components: {
		Calculator
	},

	data: function () {
		return {
			value: 0
		};
	},

	props: {},

	computed: {
		cost: function () {
			let events = this.value;

			let costData = generateCost(prices, events);

			return costData;

			const cost = costData.cost;

			return cost;
		}
	},

	methods: {
		onValue: function (e) {
			this.value = e;
		}
	}
};
</script>

<style lang="scss">
.c-pricing {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	padding-top: var(--spacer-sm);

	blockquote {
		flex-grow: 0;
		display: block;
		max-width: 400px;
		margin: 2rem auto;
		padding: var(--margin-lg);
		background-color: var(--color-bg-4);
		border-radius: var(--border-radius);
		text-align: center;

		p {
			opacity: 0.85;
			margin-bottom: 0;
		}
	}

	.c-calculator {
		margin-bottom: 1rem;
	}

	&__card {
		border: 1px solid var(--color-translucent);
		background-color: var(--color-bg-2);
		transition: filter 0.2s ease-out;
		border-radius: var(--border-radius-lg);
		width: 100%;

		// &:hover,
		// &:active {
		// 	filter: brightness(150%);
		// }

		header {
			padding: var(--spacer-sm) var(--spacer) 0 var(--spacer);
			text-align: center;

			span {
				display: block;
				font-weight: 500;
				margin-bottom: 1rem;
				color: var(--color-font-light);
			}
		}

		section {
			padding: var(--spacer);
			padding-top: 0;

			h5 {
				font-weight: 500;
			}

			h3.h2 {
				font-weight: 400;
				margin: 0.5rem 0;

				span {
					font-size: var(--font-size-sm);
					opacity: 0.8;
				}
			}
		}
	}

	@media screen and (max-width: 576px) {
		&__card {
			header {
				padding: var(--spacer) var(--margin-lg) 0 var(--margin-lg);
			}
			section {
				padding: var(--margin-lg);
			}
		}
	}
}
</style>
