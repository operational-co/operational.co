<template>
	<a :class="['c-accordion', { active: active }]">
		<div class="c-accordion__title" @click.prevent="toggleActive">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M3.29289 8.29289C3.68342 7.90237 4.31658 7.90237 4.70711 8.29289L12 15.5858L19.2929 8.29289C19.6834 7.90237 20.3166 7.90237 20.7071 8.29289C21.0976 8.68342 21.0976 9.31658 20.7071 9.70711L13.4142 17C12.6332 17.781 11.3669 17.781 10.5858 17L3.29289 9.70711C2.90237 9.31658 2.90237 8.68342 3.29289 8.29289Z"
					fill="currentColor"
				/>
			</svg>
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
		const bodyStyle = ref({ height: "0px", overflow: "hidden", transition: "all 200ms ease" });

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
	background-color: var(--color-bg-2);
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
		position: relative;
		padding: var(--spacer-sm);
		padding-right: var(--spacer-lg);
		user-select: none;
		font-weight: 500;

		h2,
		h3,
		h4 {
			margin: 0;
		}

		> svg {
			display: block;
			position: absolute;
			top: 1rem;
			right: 1rem;
		}
	}

	&__body {
		padding: 0 var(--spacer-sm);
		overflow: hidden;
	}

	&.active {
		.c-accordion__title {
			> svg {
				transform: rotate(180deg);
			}
		}
	}
}
</style>
