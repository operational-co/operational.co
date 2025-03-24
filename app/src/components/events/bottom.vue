<template>
	<div class="c-events-bottom">
		<span>That's all folks</span>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.c-events-bottom {
	margin: var(--spacer-sm) 0;
	position: relative;
	//font-family: var(--font-family-monospace);
	font-style: italic;
	display: flex;
	justify-content: center;
	opacity: 0.75;

	span {
		position: relative;
		z-index: 1;
		display: inline-block;
		margin: 0 auto;
		padding: 0 var(--spacer-sm);
		background-color: var(--color-bg-1);
	}

	&:after {
		content: "";
		position: absolute;
		top: 10px;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: var(--color-bg-3);
	}
}
</style>
