<template>
	<div class="p-styleguide">
		<article>
			<h1>H1 heading</h1>
			<h2>H2 heading</h2>
			<h3>H3 heading</h3>
			<h4>H4 heading</h4>
			<h5>H5 heading</h5>
			<h6>H6 heading</h6>

			<hr />

			<a href="#" class="btn">Basic button</a>
			<a href="#" class="btn btn-sm">Basic button</a>
			<a href="#" class="btn btn-lg">Basic button</a>
		</article>
	</div>
</template>

<script>
export default {
	components: {},

	beforeRouteEnter: async function (to, from, next) {
		next((vm) => {
			// vm.$store.app.setLoading(true);
			// vm.$store.reports.refresh().then(() => {
			//   vm.$store.app.setLoading(false);
			// });
		});
	},
};
</script>

<style lang="scss">
.p-styleguide {
	min-height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	article {
		padding: 0 var(--margin-lg);
		text-align: center;
	}
}
</style>
