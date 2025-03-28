<template>
	<div class="c-landing-intro">
		<div class="d-intro">
			<Constrain size="sm">
				<div class="text-center">
					<h1>Open-source Event Tracker for your product</h1>
				</div>
				<article class="article-container article-text">
					<p>Understand what’s happening in your product, find issues and respond to them in realtime.</p>
				</article>

				<div class="btn-container">
					<a target="_blank" href="https://discord.gg/BdTbsQhRzc" class="btn btn-fancy btn-primary">
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
					<a target="_blank" href="https://app.operational.co?signinas=kevin" class="btn btn-fancy">
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

				<div class="script-container">
					<span class="article-text">Or self host:</span>
					<Code :copy="false"
						>bash <(curl -s https://raw.githubusercontent.com/operational-co/operational.co/v0.0.3/bin/setup.sh)
					</Code>
					<p>
						Full instructions <a href="/selfhosted/install-locally">here</a>. Docker instructions
						<a href="/selfhosted/docker">here</a>.
					</p>
				</div>

				<nav>
					<span @click="setTopic('saas')" :class="[{ active: currentTopic === 'saas' }]"> SaaS </span>
					<span @click="setTopic('wordpress')" :class="[{ active: currentTopic === 'wordpress' }]"> Wordpress </span>
					<span @click="setTopic('ecom')" :class="[{ active: currentTopic === 'ecom' }]"> eCom </span>
					<span @click="setTopic('devops')" :class="[{ active: currentTopic === 'devops' }]"> Dev Ops </span>
				</nav>

				<Roller ref="roller" :item="rollerItem"></Roller>
			</Constrain>
		</div>

		<!--

		<div class="d-explainer">
			<Constrain size="sm">
				<div class="d-explainer__inner">
					<article>
						<h2>Track Events</h2>
						<ul>
							<li>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
										fill="currentColor"
									/>
								</svg>
								<span> Send Events via our Nodejs SDK </span>
							</li>
							<li>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
										fill="currentColor"
									/>
								</svg>
								<span> Use the Playground to generate Event code </span>
							</li>
							<li>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
										fill="currentColor"
									/>
								</svg>
								<span> Send JSON, image urls and more </span>
							</li>
						</ul>
					</article>
					<section>
						<Carousel v-bind="carouselConfig" @slide-start="handleSlideStart">
							<Slide v-for="(screenshot, i) in screenshots" :key="i">
								<img :src="`/images/index/${screenshot}`" />
							</Slide>
							<template #addons>
								<div class="carousel-dots">
									<span v-for="(item, i) in screenshots" :key="i" :class="[{ active: i === currentSlideIndex }]">
									</span>
								</div>
							</template>
						</Carousel>
					</section>
				</div>
			</Constrain>
		</div>

		<div class="d-explainer">
			<Constrain size="sm">
				<div class="d-explainer__inner">
					<article>
						<h2>Receive push notifications</h2>
						<ul>
							<li>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
										fill="currentColor"
									/>
								</svg>
								<span> Mobile notifications </span>
							</li>
							<li>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
										fill="currentColor"
									/>
								</svg>
								<span> Desktop notifications </span>
							</li>
						</ul>
					</article>
					<section>
						<Carousel v-bind="carouselConfig" @slide-start="handleSlideStart">
							<Slide v-for="(screenshot, i) in notificationScreenshots" :key="i">
								<img :src="`/images/index/${screenshot}`" />
							</Slide>
							<template #addons>
								<div class="carousel-dots">
									<span
										v-for="(item, i) in notificationScreenshots"
										:key="i"
										:class="[{ active: i === currentSlideIndex }]"
									>
									</span>
								</div>
							</template>
						</Carousel>
					</section>
				</div>
			</Constrain>
		</div>

		-->

		<div class="d-explainer">
			<Constrain>
				<h2 class="text-center">Track & respond to your product in realtime</h2>
				<div class="d-explainer__inner left">
					<article>
						<h3>Get notified for critical events</h3>
						<p>Receive push notifications on your mobile or in the webapp.</p>
					</article>
					<section>
						<img alt="Operational.co push notifications" :src="`/images/index/feature1.jpg`" />
					</section>
				</div>

				<div class="d-explainer__inner right">
					<article>
						<h3>Run actions on events</h3>
						<p>Use Action Buttons to trigger webhooks within your product.</p>
					</article>
					<section>
						<img alt="Operational.co Action buttons" :src="`/images/index/feature2.jpg`" />
					</section>
				</div>

				<div class="d-explainer__inner left">
					<article>
						<h3>Understand complex workflows</h3>
						<p>Chain events together to get a better understanding of your workflows.</p>
					</article>
					<section>
						<img alt="Operational.co contexts" :src="`/images/index/feature3.jpg`" />
					</section>
				</div>
			</Constrain>
		</div>

		<div class="d-usage">
			<Constrain>
				<h2>Get started with a few lines of code</h2>
				<div class="d-usage__grid">
					<Code :text="code"> </Code>

					<svg width="91" height="104" viewBox="0 0 91 104" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M91 13.4971C91 12.0389 91 10.5328 90.8313 9.00282C90.8313 8.21394 90.7108 7.42505 90.6626 6.61225L90.3976 4.7715C90.1807 4.07824 89.9156 3.385 89.6746 2.66783C88.8072 1.97456 88.0361 0.874893 86.6144 0.683648C85.8236 0.488216 85.0175 0.360244 84.2047 0.301147H82.5903C81.6505 0.301147 80.7348 0.301147 79.8674 0.301147C78.1083 0.301147 76.3974 0.516308 74.7348 0.683648C71.4094 0.994422 68.2528 1.40081 65.2407 1.83111C59.2647 2.69172 53.9153 3.67186 49.4574 4.60418C40.5417 6.46883 35.1681 8.19005 35.3368 9.09847C35.5054 10.0069 41.1923 9.91123 50.2526 9.21797L66.0841 7.87925L75.3613 7.13818C76.1083 7.13818 76.8552 7.13817 77.6263 7.01865C71.9055 11.2644 66.4196 15.8131 61.1925 20.6449C53.5214 27.7228 46.2263 35.1914 39.3368 43.0206C31.8527 51.5482 24.8692 60.4957 18.421 69.819C6.20396 87.4375 -0.856388 102.761 0.0833808 103.287C1.02315 103.813 10.3004 89.6129 23.6499 73.118C30.2765 64.8705 37.9392 56.0254 45.6501 47.8974C53.361 39.7695 61.1202 32.3348 67.5058 26.3823C75.289 19.2106 80.5421 14.7402 83.9397 11.6085C83.9397 12.2779 83.9397 12.9712 83.9397 13.6405C84.0843 16.4853 84.2047 19.2345 84.3252 21.8402C84.5662 27.0756 84.8071 31.8089 85.0963 35.7533C85.6746 43.69 86.4457 48.5668 87.506 48.5907C88.5662 48.6146 89.4819 43.8096 90.2048 35.8011C90.5662 31.8328 90.8554 27.0756 91 21.7924C91 19.1389 91 16.3419 91 13.4254"
							fill="currentColor"
						/>
					</svg>

					<Card :item="codeItem"></Card>
				</div>
				<article class="article-text">
					<p>Tracking tools can be notoriously hard to integrate.</p>
					<p>
						To make this easier, we have a Playground where you can copy-paste code and simply sprinkle it in your
						codebase.
					</p>
				</article>
				<div class="text-center">
					<a href="/playground" class="btn btn-fancy">
						<span> Visit the Playground </span>
					</a>
				</div>
			</Constrain>
		</div>

		<!-- <div class="d-user">
			<Constrain>
				<h2>
					Operational is the tool for 
				</h2>
				<div class="d-user__grid">
					<ul>
						<li>
							<span>
								SaaS founders
							</span>
						</li>
						<li>
							<span>
								Wordpress devs
							</span>
						</li>
						<li>
							<span>
								Mobile app devs
							</span>
						</li>
						<li>
							<span>
								Industry specific devs
							</span>
						</li>
					</ul>
				</div>
			</Constrain>
		</div> -->

		<div class="d-examples">
			<Constrain>
				<h2>Cool things you can do with Operational</h2>
				<div class="d-examples__grid">
					<article>
						<span>Get notified for waitlist signups</span>
						<Card :initialExpand="false" :item="coolItems[0]"></Card>
					</article>
					<article>
						<span> Understand who signed up</span>
						<Card :initialExpand="false" :item="coolItems[1]"></Card>
					</article>
					<article>
						<span> Get alerts for critical events </span>
						<Card :initialExpand="false" :item="coolItems[2]"></Card>
					</article>
					<article>
						<span> Know when your cronjobs run </span>
						<Card :initialExpand="false" :item="coolItems[3]"></Card>
					</article>
					<article>
						<span> Receive webhook notifications </span>
						<Card :initialExpand="false" :item="coolItems[4]"></Card>
					</article>
					<article>
						<span> Get notified when someone pays </span>
						<Card :initialExpand="false" :item="coolItems[5]"></Card>
					</article>
				</div>
				<article class="article-text">
					<p>And much more..</p>
					<p>
						Operational has <i>an extremely expressive API</i>. Use it to solve operational problems inside your product
						and free up your time.
					</p>
				</article>
			</Constrain>
		</div>

		<div class="d-callout">
			<Constrain size="sm">
				<div class="d-callout__inner">
					<p>Hey friend,</p>
					<p>In the early days of running my SaaS(Swipekit), I had no clue what was happening inside my product.</p>
					<ul>
						<li>Did that cronjob run?</li>
						<li>Who's signing up? Need to know their details</li>
						<li>Need to get server vars for debugging</li>
						<li>Need to understand billing workflows</li>
					</ul>
					<p>
						I tried a bunch of tools for a few months. They were unfortunately very basic and none of them were purpose
						built for tech founders.
					</p>
					<p>So I built Operational.</p>
					<hr />
					<p>
						Today, Operational helps me manage my SaaS and saves me hours that would be spent on pointless rot work
						otherwise.
					</p>
					<p>If you want to streamline your work just as I did, Operational is waiting for you.</p>

					<article>
						<img src="/shash.jpg" />
						<span> Shash </span>
						<span> Founder, Operational </span>
					</article>
				</div>
			</Constrain>
		</div>
	</div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Card from "@operational.co/components/card/index.vue";
import Code from "@operational.co/components/code/index.vue";
import Heading from "./ui/heading.vue";
import HeroIllustration from "./ui/hero-illustration.vue";
import Accordion from "@/components/ui/accordion.vue";
import Roller from "@/components/roller/index.vue";

import SvgClickme from "./ui/svg-clickme.vue";

import "vue3-carousel/carousel.css";

import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

export default {
	components: {
		Card,
		Code,
		Constrain,
		Heading,
		HeroIllustration,
		Accordion,
		Roller,
		SvgClickme,

		Carousel,
		Slide,
		Pagination,
		Navigation
	},

	data: function () {
		let date = new Date();
		date = date.toISOString();
		return {
			rollerItem: null,
			currentTopic: "saas",
			currentSlideIndex: 0,
			carouselConfig: {
				autoplay: 2500,
				itemsToShow: 3,
				wrapAround: true,
				dir: "btt",
				height: 220,
				touchDrag: false
			},
			code: `import Operational from "@operational.co/sdk";
const ops = new Operational("API_KEY");

await ops.events.ingest({
  name: "user signup",
  avatar: "😃"
});`,
			notificationScreenshots: ["notification-desktop.jpg", "notification-mobile.jpg"],
			screenshots: ["notification-desktop.jpg", "notification-mobile.jpg"],
			codeItem: {
				createdAt: date,
				name: "user signup",
				avatar: "😃"
			},

			saasItems: [
				{
					createdAt: date,
					name: "user signed up",
					avatar: "😃",
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
					]
				},
				{
					createdAt: date,
					name: "user activated",
					avatar: "🎉",
					content: "Shash(shash@operational.co) has activated their account!"
				},
				{
					createdAt: date,
					name: "stripe: webhook received",
					avatar: "🤖",
					type: "json",
					content: {
						automatically_finalizes_at: null,
						billing_reason: "subscription_cycle",
						charge: "ch_3D3n99Hz9gs7nFzM0BaYP51x",
						collection_method: "charge_automatically",
						created: 1742250124,
						currency: "usd",
						custom_fields: null,
						customer: "cus_QgHjGQ2X51GBwz",
						customer_address: null,
						customer_email: "ryan@cypressagencygroup.com",
						customer_name: "Cypress",
						customer_phone: null,
						customer_shipping: null,
						customer_tax_exempt: "none"
					}
				},
				{
					createdAt: date,
					name: "user subscribed",
					avatar: "💸"
				},
				{
					createdAt: date,
					name: "cronjob completed",
					avatar: "🤖"
				},
				{
					createdAt: date,
					name: "stripe: early fraud warning",
					avatar: "🚨"
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
					]
				}
			],
			wordpressItems: [
				{
					createdAt: date,
					name: "theme_switched",
					avatar: "🖼️",
					type: "rows",
					content: [
						{
							label: "Previous theme",
							content: "Avada"
						},
						{
							label: "Current theme",
							content: "Twenty twentytwo"
						}
					]
				},
				{
					createdAt: date,
					name: "user login failed",
					avatar: "‼️"
				},
				{
					createdAt: date,
					name: "user login",
					avatar: "😃"
				},
				{
					createdAt: date,
					name: "user signup",
					avatar: "😊"
				}
			],
			ecomItems: [
				{
					createdAt: date,
					name: "product added to cart",
					avatar: "🛒",
					type: "rows",
					content: [
						{
							label: "product name",
							content: "Lego Star Wars Venator"
						},
						{
							label: "sku",
							content: "133742069"
						},
						{
							label: "url",
							content: "https://www.lego.com/en-au/product/venator-class-republic-attack-cruiser-75367"
						}
					]
				},
				{
					createdAt: date,
					name: "payment received",
					avatar: "💸"
				},
				{
					createdAt: date,
					name: "product delivery fulfilled",
					avatar: "👍",
					contexts: [
						{
							createdAt: date,
							name: "Product purchased"
						},
						{
							createdAt: date,
							name: "Shipped",
							avatar: "🚢"
						},
						{
							createdAt: date,
							name: "confirmation received product",
							avatar: "🫴"
						}
					]
				},
				{
					createdAt: date,
					name: "stripe: fraud warning",
					avatar: "😳",
					type: "json",
					content: {
						automatically_finalizes_at: null,
						billing_reason: "subscription_cycle",
						charge: "ch_3D3n99Hz9gs7nFzM0BaYP51x",
						collection_method: "charge_automatically",
						created: 1742250124,
						currency: "usd",
						custom_fields: null,
						customer: "cus_QgHjGQ2X51GBwz",
						customer_address: null,
						customer_email: "ryan@cypressagencygroup.com",
						customer_name: "Cypress",
						customer_phone: null,
						customer_shipping: null,
						customer_tax_exempt: "none"
					}
				}
			],
			devopsItems: [
				{
					createdAt: date,
					name: "cronjob finished",
					avatar: "🤖"
				},
				{
					createdAt: date,
					name: "server near cpu capacity",
					avatar: "📈"
				},
				{
					createdAt: date,
					name: "too many login attempts",
					avatar: "🚨"
				},
				{
					createdAt: date,
					name: "server near disk capacity",
					avatar: "📈"
				}
			],
			coolItems: [
				{
					createdAt: date,
					name: "someone joined waitlist",
					avatar: "🎉",
					content: "shash@operational.co joined the waitlist",
					actions: [
						{
							key: "approve",
							buttonText: "Approve",
							url: "https://api.operational.com/health"
						},
						{
							key: "remove",
							buttonText: "Remove user",
							url: "https://api.operational.com/health"
						}
					]
				},
				{
					createdAt: date,
					name: "user signed up",
					avatar: "😃",
					type: "rows",
					content: [
						{
							label: "Name",
							content: "Shash"
						},
						{
							label: "Email",
							content: "shash@operational.co"
						}
					],
					actions: [
						{
							key: "approve",
							buttonText: "Approve",
							url: "https://api.operational.com/health"
						},
						{
							key: "remove",
							buttonText: "Remove user",
							url: "https://api.operational.com/health"
						}
					]
				},
				{
					createdAt: date,
					name: "login failed multiple times",
					avatar: "🚨",
					type: "rows",
					content: [
						{
							label: "IP",
							content: "172.69.42.042"
						},
						{
							label: "Email",
							content: "daw4121@mailinator.com"
						}
					],
					actions: [
						{
							key: "approve",
							buttonText: "Ban IP",
							url: "https://api.operational.com/health"
						}
					]
				},
				{
					createdAt: date,
					name: "running cronjobs",
					avatar: "🤖",
					type: "rows",
					contexts: [
						{
							createdAt: date,
							name: "checking activated users"
						},
						{
							createdAt: date,
							name: "checking disabled users"
						},
						{
							createdAt: date,
							name: "reconcilling payments"
						},
						{
							createdAt: date,
							name: "disabling redundant users"
						}
					]
				},
				{
					createdAt: date,
					name: "stripe webhook received",
					avatar: "🤖",
					type: "json",
					content: {
						automatically_finalizes_at: null,
						billing_reason: "subscription_cycle",
						charge: "ch_3D3n99Hz9gs7nFzM0BaYP51x",
						collection_method: "charge_automatically",
						created: 1742250124,
						currency: "usd",
						custom_fields: null,
						customer: "cus_QgHjGQ2X51GBwz",
						customer_address: null,
						customer_email: "ryan@cypressagencygroup.com",
						customer_name: "Cypress",
						customer_phone: null,
						customer_shipping: null,
						customer_tax_exempt: "none"
					}
				},
				{
					createdAt: date,
					name: "user subscribed",
					avatar: "💸",
					type: "rows",
					content: [
						{
							label: "Email",
							content: "shash@operational.co"
						},
						{
							label: "Plan",
							content: "Pro - monthly"
						}
					]
				}
			]
		};
	},

	computed: {
		computedItems: function () {
			if (this.currentTopic === "saas") {
				return this.saasItems;
			}
			if (this.currentTopic === "wordpress") {
				return this.wordpressItems;
			}
			if (this.currentTopic === "ecom") {
				return this.ecomItems;
			}
			if (this.currentTopic === "devops") {
				return this.devopsItems;
			}
			return [];
		},
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
		setTopic: function (topic) {
			this.$refs.roller.clear();
			this.currentTopic = topic;
		},
		handleSlideStart: function (e) {
			if (e.slidingToIndex === e.slidesCount) {
				this.currentSlideIndex = 0;
			} else {
				this.currentSlideIndex = e.slidingToIndex;
			}
		},
		onSlideClick: function (i) {
			this.$refs.carousel.slideTo(i);
		},
		setupCounter: function () {
			let counter = 0;

			// Run the first iteration immediately
			let tempItem = this.computedItems[counter];
			if (!tempItem) {
				counter = 0;
				tempItem = this.computedItems[counter];
			}
			this.rollerItem = tempItem;

			// Then set the interval to run every 2000ms
			setInterval(() => {
				let tempItem = this.computedItems[counter];

				if (!tempItem) {
					counter = 0;
					tempItem = this.computedItems[counter];
				}

				this.rollerItem = tempItem;

				counter++;
			}, 1200);
		}
	},

	mounted: function () {
		this.setupCounter();
	}
};
</script>

<style lang="scss">
.c-landing-intro {
	.d-intro {
		position: relative;
		padding: 5rem 0;
		padding-top: 10rem;

		.subtitle {
			position: relative;
			display: inline-block;
			margin-bottom: 1rem;
			font-weight: 500;

			&:after {
				content: "Beta";
				font-family: var(--font-family-monospace);
				font-size: var(--font-size-sm);
				display: inline-block;
				padding: var(--margin);
				background-color: var(--color-bg-3);
				line-height: 1;
				border-radius: var(--border-radius);
			}
		}

		h1 {
			position: relative;
			z-index: 1;
			text-align: center;
		}

		.article-text {
			position: relative;
			z-index: 1;
			text-align: center;
			color: var(--color-font);
		}

		nav {
			position: relative;
			z-index: 1;
			width: 400px;
			margin: 0 auto;

			display: flex;
			align-items: center;
			justify-content: center;

			> span {
				display: inline-block;
				padding: var(--margin) var(--margin-lg);
				color: var(--color-font);
				margin: 0 var(--margin-sm);
				font-weight: 500;
				font-size: var(--font-size-sm);
				line-height: 1;
				border-radius: var(--border-radius);
				opacity: 0.8;

				transition: all var(--transition-time-sm) linear;
				user-select: none;

				cursor: pointer;

				&:hover,
				&:active,
				&.active {
					opacity: 1;
					background-color: var(--color-bg-4);
				}
			}
		}

		&:after {
			content: "";
			position: absolute;
			top: calc(50% - 100px);
			left: 50%;
			width: 0;
			height: 200px;
			border-radius: 99px;
			background-color: hsl(210, 100%, 50%);

			opacity: 0.2;

			pointer-events: none;

			box-shadow:
				0px 0px 512px 128px hsl(230, 100%, 20%),
				0px 0px 128px 32px hsl(230, 100%, 20%),
				0px 0px 32px 0px hsl(230, 100%, 20%);
		}

		.btn-container {
			position: relative;
			z-index: 1;
			text-align: center;
			margin-bottom: 2rem;

			a {
				margin: 0 var(--margin);
				min-width: 183px;
			}
		}

		.article-container {
			display: none;
		}

		.script-container {
			margin-top: -1rem;
			margin-bottom: 2rem;
			position: relative;
			z-index: 1;
			> span {
				display: block;
				margin: 0 auto;
				margin-bottom: 0.5rem;
				text-align: center;
			}
			.c-code {
				margin-bottom: 0.5rem;
				background-color: var(--color-bg-2);
				box-shadow:
					inset 0 -1px 1px 0 rgba(0, 0, 0, 0.005),
					inset 0 1px 1px 0 rgba(255, 255, 255, 0.025),
					inset 0 5px 20px 1px rgba(255, 255, 255, 0.025),
					0px 2px 5px 0px rgba(60, 66, 87, 0.08),
					0px 1px 1px 0px rgba(0, 0, 0, 0.12),
					0 0 0 1px rgba(0, 0, 0, 0.15);

				code {
					font-size: var(--font-size-sm);
				}
			}
			> p {
				font-size: var(--font-size-xs);
				text-align: center;
			}
		}

		@media screen and (max-width: 1300px) {
			padding-top: 5rem;
		}

		@media screen and (max-width: 576px) {
			padding: 3rem 0;
			padding-top: 2rem;

			nav {
				width: 100%;

				> span {
					padding: 4px 6px;
					margin: 0 2px;
				}
			}

			.article-container {
				display: block;
			}

			.item-container {
				margin-top: 1.5rem;
				max-width: 380px;

				.c-card {
					transform: translateX(0) !important;
				}
			}

			.btn-container {
				margin-left: 2rem;
				width: calc(100% - 4rem);
				margin: 0 auto;

				.btn {
					width: 100%;
					margin-bottom: 1rem;
				}
			}

			.script-container {
				display: none;
			}
		}
	}

	.d-usage {
		padding: 5rem 0;
		overflow-x: hidden;

		h2,
		.article-text {
			text-align: center;
		}

		&__grid {
			position: relative;
			margin-top: 2rem;
			margin-bottom: 1rem;
			margin-left: 0;
			width: calc(100% + 4rem);
			display: grid;
			grid-template-columns: 1.2fr 0.8fr;
			align-items: center;

			.c-code {
				transform: rotate(-2deg) translateX(2rem);
				box-shadow:
					0px 0px 2px rgba(3, 7, 18, 0.12),
					0px 1px 10px rgba(3, 7, 18, 0.24),
					0px 2px 22px rgba(3, 7, 18, 0.36);
			}

			.c-card {
				z-index: 1;
				margin-left: -2rem;
				transform: rotate(5deg) translateX(-2rem) translateY(1rem);
				box-shadow:
					0px 0px 2px rgba(3, 7, 18, 0.12),
					0px 1px 10px rgba(3, 7, 18, 0.24),
					0px 2px 22px rgba(3, 7, 18, 0.36);
			}

			> svg {
				position: absolute;
				z-index: 1;
				bottom: 2.5rem;
				left: calc(50% - 5.5rem);
				transform: scale(0.65) rotate(35deg);
				opacity: 0.95;
			}
		}

		@media screen and (max-width: 576px) {
			padding: 3rem 0;

			&__grid {
				display: block;
				margin-left: 0;
				width: 100%;

				.c-code {
					transform: rotate(0);
					margin-bottom: 0;
				}
				.c-card {
					margin-left: 0;
					transform: rotate(0);
				}

				> svg {
					position: relative;
					margin: 0.5rem 0;
					z-index: 1;
					bottom: initial;
					left: calc(50% - 1rem);
					transform: scale(0.6) translateX(-50%) rotate(130deg);
					opacity: 1;
				}
			}
		}
	}

	.d-explainer {
		padding: 5rem 0;

		svg {
			display: inline-block;
			margin-bottom: 0.5rem;
			width: 32px;
			height: 32px;
			color: var(--color-primary-light);
		}

		h2 {
			margin-bottom: 2rem;
		}

		article {
			padding: var(--spacer);

			p {
				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		ul {
			margin: 0;
			padding: 0;
			list-style: none;
			margin-bottom: 1rem;

			li {
				display: flex;
				margin-bottom: 0.5rem;

				svg {
					color: var(--color-success);
					min-width: 24px;
					margin-right: var(--margin);
				}

				span {
					font-weight: 500;
					font-variation-settings: "opsz" 12;
				}
			}
		}

		section {
			img {
				border-left: var(--color-translucent) solid 1px;
				border-top-right-radius: var(--border-radius-lg);
				border-bottom-right-radius: var(--border-radius-lg);
			}
		}

		&__inner {
			border-radius: var(--border-radius-lg);
			background-color: var(--color-bg-2);
			display: grid;
			grid-template-columns: 0.85fr 1.15fr;
			align-items: center;
			margin-bottom: 3rem;

			&.right {
				grid-template-columns: 1.15fr 0.85fr;
				section {
					order: -1;

					img {
						border-left: none;
						border-right: var(--color-translucent) solid 1px;
						border-top-right-radius: 0;
						border-bottom-right-radius: 0;
						border-top-left-radius: var(--border-radius-lg);
						border-bottom-left-radius: var(--border-radius-lg);
					}
				}
			}
		}

		@media screen and (max-width: 576px) {
			padding: 3rem 0;

			&__inner {
				padding: var(--spacer-sm);
				padding-top: var(--spacer);
				display: block;
			}

			article {
				padding: 0;
				padding-bottom: var(--spacer);
			}

			section {
				margin-left: calc(var(--spacer-sm) * -1);
				margin-bottom: calc(var(--spacer-sm) * -1);
				width: calc(100% + var(--spacer-sm) * 2);
				img {
					border-top: var(--color-translucent) solid 1px;
					border-left: none !important;
					border-right: none !important;
					border-radius: 0;
					border-top-left-radius: 0 !important;
					border-top-right-radius: 0 !important;
					border-bottom-left-radius: var(--border-radius-lg);
					border-bottom-right-radius: var(--border-radius-lg);
				}
			}
		}
	}

	.d-examples {
		padding: 5rem 0;
		overflow-x: hidden;

		h2,
		.article-text {
			text-align: center;
		}

		&__grid {
			margin-left: -3rem;
			width: calc(100% + 6rem);
			padding: 1rem 0;
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-column-gap: var(--margin-lg);

			> article {
				//transform: rotate(-3deg);
				> span {
					display: inline-block;
					padding-bottom: 0.5rem;
					font-size: var(--font-size-lg);
					font-weight: 600;
					//transform: rotate(-2deg) translateX(-25%) translateY(0.5rem);
					font-family: "Caveat";
				}

				.c-card {
					box-shadow:
						0px 0px 2px rgba(3, 7, 18, 0.12),
						0px 1px 10px rgba(3, 7, 18, 0.24),
						0px 2px 22px rgba(3, 7, 18, 0.36);
				}

				&:nth-child(2n) {
					//transform: rotate(3deg);
					//transform: translateY(33%);
					text-align: right;
					.c-card {
						text-align: left;
					}
					> span {
						//transform: rotate(2deg) translateX(25%) translateY(0.5rem);
					}
				}
			}
		}

		@media screen and (max-width: 576px) {
			padding: 3rem 0;

			&__grid {
				display: block;
				margin-left: 0;
				width: 100%;

				> article {
					transform: rotate(0deg);

					> span {
						display: block;
						padding-bottom: 0.125rem;
						text-align: center;
						//transform: rotate(-2deg);
					}

					&:nth-child(2n) {
						transform: rotate(0deg);
						text-align: left;

						> span {
							//transform: rotate(2deg);
						}
					}
				}
			}
		}
	}

	.d-callout {
		padding: 5rem 0;

		--img-width: 48px;

		&__inner {
			padding: 3rem;
			border-radius: var(--border-radius-lg);
			border: var(--color-translucent) solid 1px;
			background-color: var(--color-bg-2);

			font-family: var(--font-family-monospace);
			letter-spacing: -0.25px;
			color: var(--color-font-light);
			filter: brightness(112.5%);

			article {
				margin-top: 2rem;
				display: grid;
				grid-template-columns: var(--img-width) 1fr;
				grid-template-rows: auto auto;
				grid-column-gap: var(--margin-lg);
				align-items: center;
				width: 100%;
				justify-items: start;
				img {
					width: var(--img-width);
					height: var(--img-width);
					border-radius: 99px;
					background-color: #000;

					grid-column: 1 / 2;
					grid-row: span 2;
				}

				span {
					&:nth-of-type(1) {
						grid-column: 2 / 3;
						grid-row: 1 / 2;
					}
					&:nth-of-type(2) {
						grid-column: 2 / 3;
						grid-row: 2 / 2;
					}
				}
			}
		}

		@media screen and (max-width: 576px) {
			padding: 3rem 0;

			--img-width: 40px;

			&__inner {
				padding: 1.5rem;
				font-size: var(--font-size-sm);
			}
		}
	}

	.carousel {
		overflow: hidden;

		img {
			width: 100%;
			height: auto;
			object-fit: cover;
			object-position: center center;
		}

		&__liveregion {
			display: none;
		}

		&-dots {
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			padding-bottom: var(--margin);

			span {
				display: inline-block;
				margin: 0 2px;
				width: 8px;
				height: 8px;
				border-radius: 4px;
				background-color: var(--color-font);
				opacity: 0.65;

				&.active {
					opacity: 1;
				}
			}
		}
	}
}
</style>
