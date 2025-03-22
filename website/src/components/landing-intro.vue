<template>
	<div class="c-landing-intro">
		<Constrain>
			<article>
				<h1>What's happening inside your product?</h1>
				<div class="chat-bubble-holder">
					<div class="chat-bubble">Did that cronjob run?</div>
					<div class="chat-bubble">Who's signing up?</div>
					<div class="chat-bubble">Need to catch that Stripe webhook for debugging!</div>
					<div class="chat-bubble">Need to know env vars when server starts</div>
				</div>
				<div class="c-spacer"></div>
				<h2 class="h1">What if you could get notified for these events?</h2>
				<div class="item-holder">
					<SvgClickme></SvgClickme>
					<Item :item="items[0]"></Item>
					<Item :item="items[1]"></Item>
					<Item :item="items[2]"></Item>
					<Item :item="items[3]"></Item>
				</div>
				<div class="c-spacer"></div>
				<h2 class="h1">That's Operational in a nutshell</h2>
				<article class="article-text">
					<p>
						Stop headaches from missing important events.<br />
						Setup Operational event tracker today and save both your time and your hairline.
					</p>
				</article>
				<div class="c-landing-intro__callout">
					<a target="_blank" href="https://discord.gg/AAn2TDYD" class="btn btn-fancy btn-lg btn-primary">
						<span> Join the waitlist </span>

						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM13.7071 8.29289C13.3166 7.90237 12.6834 7.90237 12.2929 8.29289C11.9024 8.68342 11.9024 9.31658 12.2929 9.70711L13.5858 11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H13.5858L12.2929 14.2929C11.9024 14.6834 11.9024 15.3166 12.2929 15.7071C12.6834 16.0976 13.3166 16.0976 13.7071 15.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929L13.7071 8.29289Z"
								fill="currentColor"
							/>
						</svg>
					</a>
					<a target="_blank" href="https://app.operational.co?signinas=kevin" class="btn btn-fancy btn-lg">
						<span> View live demo </span>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM16 9C16 8.44772 15.5523 8 15 8H10C9.44771 8 9 8.44772 9 9C9 9.55228 9.44771 10 10 10H12.5858L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L14 11.4142V14C14 14.5523 14.4477 15 15 15C15.5523 15 16 14.5523 16 14V9Z"
								fill="currentColor"
							/>
						</svg>
					</a>
				</div>
			</article>
			<!-- <HeroIllustration></HeroIllustration> -->
		</Constrain>

		<!-- 		<Constrain>
			<div class="c-landing-intro__callout">
				<a target="_blank" href="https://app.operational.co" class="btn btn-fancy btn-lg btn-primary">
					<span> Get started </span>

					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM13.7071 8.29289C13.3166 7.90237 12.6834 7.90237 12.2929 8.29289C11.9024 8.68342 11.9024 9.31658 12.2929 9.70711L13.5858 11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H13.5858L12.2929 14.2929C11.9024 14.6834 11.9024 15.3166 12.2929 15.7071C12.6834 16.0976 13.3166 16.0976 13.7071 15.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929L13.7071 8.29289Z"
							fill="currentColor"
						/>
					</svg>
				</a>
				<a target="_blank" href="https:/app.operational.co?signinas=kevin" class="btn btn-fancy btn-lg">
					<span> Checkout our demo </span>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM16 9C16 8.44772 15.5523 8 15 8H10C9.44771 8 9 8.44772 9 9C9 9.55228 9.44771 10 10 10H12.5858L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L14 11.4142V14C14 14.5523 14.4477 15 15 15C15.5523 15 16 14.5523 16 14V9Z"
							fill="currentColor"
						/>
					</svg>
				</a>
			</div>
		</Constrain>
		<HeroIllustration></HeroIllustration> -->
	</div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Item from "@operational.co/components/card/index.vue";
import Heading from "./ui/heading.vue";
import HeroIllustration from "./ui/hero-illustration.vue";

import SvgClickme from "./ui/svg-clickme.vue";

export default {
	components: {
		Item,
		Constrain,
		Heading,
		HeroIllustration,
		SvgClickme
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
.c-landing-intro {
	position: relative;
	margin-top: calc(var(--spacer) * -2);
	padding-top: calc(var(--spacer) * 3);
	padding-bottom: calc(var(--spacer) * 3);
	overflow-x: hidden;

	> img {
		position: absolute;
		z-index: -1;
		top: 0;
		left: 0;
		width: 100%;
		height: auto;
	}

	.c-card {
		min-width: 300px;
		margin-bottom: 0;
		box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.15);
	}

	h1,
	.h1 {
		text-align: center;
	}

	.article-text {
		color: var(--color-font);
		max-width: 600px;
		margin: 2rem auto 2rem auto;
		text-align: center;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
		font-size: var(--font-size-lg);
		font-weight: 400;
	}

	article {
		max-width: 600px;
		margin: 0 auto;
	}

	.chat-bubble-holder {
		padding: 0 3rem;
		display: flex;
		flex-direction: column;
		flex-grow: 0;
	}

	.chat-bubble {
		display: inline-block;
		position: relative;
		margin-bottom: 1rem;
		padding: var(--margin-lg);
		background-color: hsl(var(--hue-p), 74%, 45%);
		font-size: var(--font-size);
		border-radius: 26px;
		margin-right: auto;

		&:after {
			content: "😐";
			position: absolute;
			top: -1.75rem;
			left: -1.75rem;
			font-size: var(--font-size-xxxl);
			transform: rotate(-16deg);
		}

		&:nth-child(2) {
			&:after {
				content: "🤔";
			}
		}

		&:nth-child(3) {
			&:after {
				content: "🤖";
			}
		}

		&:nth-child(4) {
			&:after {
				content: "😕";
			}
		}

		&:nth-child(even) {
			margin-right: initial;
			margin-left: auto;
			text-align: right;

			&:after {
				left: auto;
				right: -1.75rem;
				transform: rotate(12deg);
			}
		}
	}

	.item-holder {
		position: relative;
		padding: 0 3rem;
		.c-card {
			max-width: 400px;
			margin-bottom: 0.5rem;

			&:nth-child(even) {
				margin-left: auto;
			}
		}

		> svg {
			position: absolute;
			top: -1rem;
			right: 1rem;
			transform: scale(1.5) rotate(5deg);
			pointer-events: none;
			user-select: none;
		}
	}

	.c-ui-heading h1 {
		font-weight: 200;
		font-family: var(--font-family-heading);
		line-height: 1.2;
		text-align: center;
		margin-bottom: 1rem;
	}

	&__callout {
		margin-bottom: 1.5rem;
		display: grid;
		grid-template-columns: max-content max-content;
		grid-column-gap: var(--margin-lg);
		justify-content: center;
	}

	@media screen and (max-width: 1240px) {
		.c-ui-heading h1 {
			font-size: 3rem;
		}
	}

	@media screen and (max-width: 880px) {
		margin-top: 0;
		padding-top: 1rem;

		.chat-bubble-holder {
			padding: 0;
		}

		.chat-bubble {
			&:after {
				//font-size: var(--font-size-lg);
				top: -1rem;
				left: -1rem;
			}

			&:nth-child(even) {
				margin-left: auto;

				&:after {
					left: auto;
					right: -1rem;
				}
			}
		}

		.item-holder {
			padding: 0;
		}

		.c-card {
			min-width: 100%;
		}

		.article-text {
			font-size: var(--font-size-xl);
		}

		&__callout {
			display: flex;
			flex-direction: column;
			max-width: 280px;
			margin: 0 auto;

			a {
				&:last-child {
					margin-top: 1rem;
				}
			}
		}
	}
}
</style>
