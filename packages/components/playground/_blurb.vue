<template>
	<div class="c-playground-blurb">
		<div class="c-playground-blurb__inner">
			<p>
				{{ example.description }}
			</p>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		example: {}
	}
};
</script>

<style lang="scss">
.c-playground-blurb {
	position: absolute;
	bottom: 0;
	left: 0;
	padding: 1rem;

	p {
		font-size: var(--font-size-sm);
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);

		&:last-of-type {
			margin-bottom: 0;
		}
	}

	&__inner {
		padding: 1rem;
		background-color: hsla(var(--hue-p), 8%, 14%, 0.65);
		backdrop-filter: blur(4px);
		border-radius: var(--border-radius);
	}
}
</style>
