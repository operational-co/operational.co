<template>
	<div class="c-tab">
		<Code v-if="active">
			<slot></slot>
		</Code>
	</div>
</template>

<script>
import Code from "@operational.co/components/code/index.vue";
export default {
	components: {
		Code
	},

	props: {
		label: {}
	},

	data: function () {
		return {
			active: false
		};
	},

	watch: {
		active: function () {
			console.log("kil me");
		}
	},

	methods: {
		setActive: function () {
			console.log(this);
			this.active = true;
		},
		setInactive: function () {
			this.active = false;
		}
	}
};
</script>

<style lang="scss">
.c-tab {
	.c-code {
		margin: 0;
	}
}
</style>
