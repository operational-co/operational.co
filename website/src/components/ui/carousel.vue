<template>
	<div class="c-carousel">
		<header>
			<span
				@click.prevent="onSlideClick(i)"
				v-for="(item, i) in items"
				:key="i"
				:class="[{ active: i === currentSlideIndex }]"
			>
				{{ item.avatar }} {{ item.name }}
			</span>
		</header>
		<Carousel ref="carousel" v-bind="carouselConfig" @slide-start="handleSlideStart">
			<Slide v-for="(item, i) in items" :key="i">
				<Item :item="item" :initialExpand="true"></Item>
			</Slide>

			<!-- <template #addons>
				<div class="c-carousel__sidebar">
					<span
						@click.prevent="onSlideClick(i)"
						v-for="(item, i) in items"
						:key="i"
						:class="[{ active: i === currentSlideIndex }]"
					>
						{{ item.name }}
					</span>
				</div>
			</template> -->
		</Carousel>
	</div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Item from "@operational.co/components/card/index.vue";

import "vue3-carousel/carousel.css";

import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

export default {
	components: {
		Item,
		Constrain,

		Carousel,
		Slide,
		Pagination,
		Navigation
	},

	data: function () {
		let date = new Date();
		date = date.toISOString();
		return {
			currentSlideIndex: 0,
			carouselConfig: {
				autoplay: 3000,
				itemsToShow: 1,
				wrapAround: true,
				dir: "ttb",
				height: 340,
				touchDrag: false
			},
			items: [
				{
					createdAt: date,
					name: "User signed up",
					avatar: "😀",
					type: "rows",
					content: [
						{
							label: "Name",
							content: "Shash"
						},
						{
							label: "email",
							content: "shash@operational.co"
						},
						{
							label: "IP",
							content: "122.569.432.1"
						}
					],
					contexts: [
						{
							createdAt: date,
							name: "User activated"
						},
						{
							createdAt: date,
							name: "User onboarded"
						}
					]
				},
				{
					createdAt: date,
					name: "Running reconcillation cronjob",
					avatar: "🤖",
					contexts: [
						{
							createdAt: date,
							name: "Open invoice not found"
						},
						{
							createdAt: date,
							name: "Open invoice not found"
						},
						{
							createdAt: date,
							name: "Open invoice not found"
						},
						{
							createdAt: date,
							name: "Open invoice found",
							actions: [
								{
									url: "https://operational.co",
									buttonText: "View in Stripe"
								}
							]
						},
						{
							createdAt: date,
							name: "Open invoice not found"
						}
					]
				},
				{
					createdAt: date,
					name: "Cleaning db entries cronjob",
					avatar: "🤖",
					content: `47 records purged. 4332 ms.`
				},
				{
					createdAt: date,
					name: "User unsubscribed",
					avatar: "😢",
					type: "rows",
					content: [
						{
							label: "email",
							content: "shash@operational.co"
						},
						{
							label: "Bookmarks created",
							content: 37
						},
						{
							label: "Invoices generated",
							content: 3
						}
					],
					actions: [
						{
							url: "https://operational.co",
							buttonText: "Offer discount"
						},
						{
							url: "https://operational.co",
							buttonText: "View in Stripe",
							external: true
						}
					]
				},
				{
					createdAt: date,
					name: "Server started",
					avatar: "🤖",
					type: "rows",
					content: [
						{
							label: "node_env",
							content: "production"
						},
						{
							label: "database_url",
							content: "mysql://ops:sKz9y26Q5pw9@42.33.120.69/ops"
						},
						{
							label: "stripe",
							content: true
						},
						{
							label: "email",
							content: true
						},
						{
							label: "cron",
							content: true
						}
					]
				},
				{
					createdAt: date,
					name: "Stripe webhook received",
					avatar: "🤖",
					type: "json",
					content: {
						object: {
							id: "in_3Pv2p8Hz7gs3nFkM12wl9pYF",
							object: "invoice",
							account_country: "AU",
							account_name: "Swipekit",
							account_tax_ids: null,
							amount_due: 3000,
							amount_paid: 0,
							amount_remaining: 3000,
							amount_shipping: 0,
							application: null,
							application_fee_amount: null,
							attempt_count: 3,
							attempted: true,
							auto_advance: true,
							automatic_tax: {
								enabled: false,
								liability: null,
								status: null
							},
							automatically_finalizes_at: null,
							billing_reason: "subscription_cycle",
							charge: "ch_3Pv2p8Hz7gs3nFkM12wl9pYF",
							collection_method: "charge_automatically",
							created: 1725393566,
							currency: "usd",
							custom_fields: null,
							customer: "cus_Qb04V5pKZQQCN7",
							customer_address: null,
							customer_email: "davy.carl@profitable.com",
							customer_name: "Davy",
							customer_phone: null,
							customer_shipping: null,
							customer_tax_exempt: "none",
							customer_tax_ids: [],
							default_payment_method: null,
							default_source: null,
							default_tax_rates: [],
							description: null,
							discount: null,
							discounts: [],
							due_date: null,
							effective_at: 1725397178,
							ending_balance: 0,
							footer: null,
							from_invoice: null
						}
					}
				},
				{
					createdAt: date,
					name: "User payment failed",
					avatar: "😐",
					type: "rows",
					content: [
						{
							label: "email",
							content: "shash@operational.co"
						},
						{
							label: "Card",
							content: "Visa"
						}
					]
				}
			]
		};
	},

	computed: {
		firstCol() {
			return this.items.slice(0, 3);
		},
		secondCol() {
			return this.items.slice(3, 6);
		},
		thirdCol() {
			return this.items.slice(6, 9);
		}
	},

	methods: {
		handleSlideStart: function (e) {
			if (e.slidingToIndex === e.slidesCount) {
				this.currentSlideIndex = 0;
			} else {
				this.currentSlideIndex = e.slidingToIndex;
			}
		},
		onSlideClick: function (i) {
			this.$refs.carousel.slideTo(i);
		}
	}
};
</script>

<style lang="scss">
.c-carousel2 {
	position: relative;
	margin-bottom: 1rem;

	> img {
		position: absolute;
		z-index: -1;
		top: 0;
		left: 0;
		width: 100%;
		height: auto;
	}

	header {
		text-align: center;
		span {
			position: relative;
			z-index: 1;
			display: inline-block;
			font-weight: 500;
			padding: var(--margin-sm) var(--margin-lg);
			opacity: 0.25;
			transition: all var(--transition-time) var(--ease-out-quad);
			cursor: pointer;

			&:after {
				content: "";
				position: absolute;
				z-index: -1;
				bottom: 0;
				left: 4px;
				width: calc(100% - 8px);
				height: calc(100%);
				border-radius: 6px;
				background-color: var(--color-bg-5);

				transition: all var(--transition-time) var(--ease-out-quad) 60ms;
				opacity: 0;
				transform: scale(0.8);
			}

			&.active {
				opacity: 1;

				&:after {
					opacity: 1;
					transform: scale(1);
				}
			}
		}
	}

	.c-card {
		min-width: 300px;
		margin-bottom: 0;
		box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.15);
	}

	.article-text {
		text-align: center;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
	}

	.carousel {
		margin-top: 2rem;
		overflow: hidden;
		background-color: hsla(var(--hue-p), 0%, 10%, 0.5);
		backdrop-filter: blur(4px);
		border-radius: var(--border-radius-lg);

		&__track {
		}
	}

	.c-ui-heading h1 {
		font-weight: 200;
		font-family: var(--font-family-heading);
		line-height: 1.2;
		text-align: center;
		margin-bottom: 1rem;

		background: linear-gradient(to bottom, hsl(240, 0%, 97%) 30%, hsl(351, 0%, 70%));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		//color: rgba(255, 255, 255, 0.5);

		filter: drop-shadow(0px 2px 4px rgba(35, 8, 22, 0.7));
	}

	&__sidebar {
		position: absolute;
		top: 0;
		left: 0;
		width: 180px;
		height: 100%;
		background-color: var(--color-bg-3);
		padding: var(--margin) 0;

		display: flex;
		flex-direction: column;
		justify-content: space-between;

		> span {
			position: relative;
			z-index: 1;
			display: block;
			font-weight: 500;
			padding: var(--margin-sm) var(--margin-lg);
			opacity: 0.25;
			transition: all var(--transition-time) var(--ease-out-quad);
			cursor: pointer;

			&:after {
				content: "";
				position: absolute;
				z-index: -1;
				bottom: 0;
				left: 8px;
				width: calc(100% - 16px);
				height: calc(100%);
				border-radius: 6px;
				background-color: var(--color-bg-5);

				transition: all var(--transition-time) var(--ease-out-quad) 60ms;
				opacity: 0;
				transform: scale(0.8);
			}

			&.active {
				opacity: 1;

				&:after {
					opacity: 1;
					transform: scale(1);
				}
			}
		}
	}

	&__callout {
		margin-top: 1.5rem;
		text-align: center;
	}

	@media screen and (max-width: 1240px) {
	}

	@media screen and (max-width: 880px) {
		.carousel {
			margin-top: 0;
			background-color: transparent;
			backdrop-filter: blur(0);

			&__track {
				padding-left: 0;
			}
		}

		.c-card {
			min-width: 100%;
		}

		&__sidebar {
			display: none;
		}
	}
}
</style>
