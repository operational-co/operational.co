<template>
	<div class="p-offline">
		<article>
			<h1>You're offline</h1>
			<p>Operational will be back once you're connected.</p>
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
.p-offline {
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
