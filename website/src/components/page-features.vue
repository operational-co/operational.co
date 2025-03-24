<template>
	<div class="c-page-features">
		<Constrain>
			<div class="c-page-features__inner">
				<slot>
					<h2>Notifications that work for you</h2>
					<article class="article-text">
						<p>
							Capture feedback, understand user needs,<br />
							and fix operational headaches.
						</p>
					</article>
				</slot>
				<div class="c-page-features__grid">
					<div class="c-page-features__card">
						<img src="/banner.jpg" />
						<article>
							<section>
								<Subtitle subtitle="Product management"></Subtitle>
								<strong>Make better product decisions</strong>
							</section>
							<div class="icon"></div>
						</article>
					</div>
					<div class="c-page-features__card">
						<img src="/images/features/feature1.png" />
						<article>
							<section>
								<Subtitle subtitle="Product management"></Subtitle>
								<strong>Make better product decisions</strong>
							</section>
							<div class="icon"></div>
						</article>
					</div>
					<div class="c-page-features__card">
						<article>
							<section>
								<Subtitle subtitle="Product management"></Subtitle>
								<strong>Make better product decisions</strong>
							</section>
							<div class="icon"></div>
						</article>
					</div>
				</div>
			</div>
		</Constrain>
	</div>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Subtitle from "./ui/subtitle.vue";

export default {
	components: {
		Constrain,
		Subtitle
	},

	props: {
		subtitle: {
			default: "Landing page"
		},
		heading: {
			type: String,
			default: "h2"
		}
	},

	computed: {
		headingType: function () {
			return this.heading;
		}
	}
};
</script>

<style lang="scss">
.c-page-features {
	padding: 4rem 0;

	&__inner {
	}

	&__grid {
		display: grid;
		grid-auto-flow: column;
		grid-gap: var(--spacer-sm);
		min-width: fit-content;
		padding-top: var(--spacer);
	}

	&__card {
		border: none;
		border-radius: 20px;
		overflow: hidden;
		transition: filter 0.2s ease-out;
		height: 394px;
		padding: 0;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		cursor: pointer;

		border: 1px solid var(--color-translucent);

		background-color: var(--color-bg-2);

		&:hover,
		&:active {
			filter: brightness(150%);
		}

		img {
			display: block;
			height: 100%;
			object-fit: cover;
			object-position: center center;
		}

		article {
			padding: 24px 24px;
			margin-top: auto;
			display: flex;
			align-items: flex-end;
			gap: 8px;
			justify-content: space-between;
			width: 100%;
		}
	}
}
</style>
