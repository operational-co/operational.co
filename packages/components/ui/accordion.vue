<template>
	<a :class="['c-accordion', { active: active }]">
		<div class="c-accordion__title" @click.prevent="toggleActive">
			<slot name="title">
				<h3>How is Operational so good?</h3>
			</slot>
		</div>
		<div ref="body" class="c-accordion__body" :style="bodyStyle">
			<slot name="body">
				<p>
					The minimum viable product, as many founders know it, doesn't reflect the reality of how products get built
					today.
				</p>
				<p>
					Building something valuable is no longer about validating a novel idea as fast as possible. Instead, the
					modern MVP exercise is about building a version of an idea that is different from and better than what exists
					today.
				</p>
			</slot>
		</div>
	</a>
</template>

<script>
import { ref, nextTick } from "vue";

export default {
	setup() {
		const active = ref(false);
		const body = ref(null);
		const bodyStyle = ref({ height: "0px", overflow: "hidden", transition: "height 0.3s ease" });

		const toggleActive = async () => {
			active.value = !active.value;

			await nextTick(); // Wait for the DOM to update
			const contentHeight = active.value ? `${body.value.scrollHeight}px` : "0px";
			bodyStyle.value = { ...bodyStyle.value, height: contentHeight };
		};

		return { active, body, bodyStyle, toggleActive };
	}
};
</script>

<style lang="scss">
.c-accordion {
	display: block;
	border: 1px solid var(--color-translucent);
	border-radius: 12px;
	margin-bottom: var(--spacer-sm);
	text-decoration: none !important;
	color: var(--color-font);
	cursor: pointer;

	&:hover,
	&:active {
		color: var(--color-font);
	}

	&__title {
		padding: var(--spacer-sm);
		user-select: none;

		h2,
		h3,
		h4 {
			margin: 0;
		}
	}

	&__body {
		padding: 0 var(--spacer-sm);
		overflow: hidden;
	}
}
</style>
