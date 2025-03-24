<template>
	<div class="c-page-cta">
		<Constrain>
			<div class="c-page-cta__inner">
				<h2>Receive product notifications and focus on what matters most - <i>building your product.</i></h2>
				<a href="https://app.operational.co" class="c-page-cta__buttons">
					<button type="button" class="btn btn-lg btn-primary">Signup</button>
				</a>
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
	}
};
</script>

<style lang="scss">
.c-page-cta {
	&__inner {
		display: grid;
		grid-template-columns: 1.5fr 0.5fr;
		grid-column-gap: var(--spacer);
		padding: var(--spacer-lg) 0;

		h2 {
			margin: 0;
			font-family: var(--font-family-heading);
			font-weight: 300;
		}
	}

	&__buttons {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
}
</style>
