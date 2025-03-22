<template>
	<div class="c-tabs">
		<header>
			<strong v-for="(label, i) in labels" :key="i" @click="onClick(label)">
				{{ label }}
			</strong>
		</header>
		<main>
			<slot></slot>
		</main>
	</div>
</template>

<script>
export default {
	data: function () {
		return {
			currentTab: ""
		};
	},

	props: {},

	watch: {
		currentTab: function () {
			console.log(`Tab changed to ${this.currentTab}`);
			this.setTab(this.currentTab);
		}
	},

	computed: {
		labels: function () {
			const comps = this.$slots.default();

			let labels = [];

			for (let i = 0; i < comps.length; i++) {
				const comp = comps[i];

				//console.log(comp);

				if (comp.props && comp.props.label) {
					labels.push(comp.props.label);
				}
			}

			return labels;
		}
	},

	methods: {
		setTab: function (label) {
			const comps = this.$slots.default();

			for (let i = 0; i < comps.length; i++) {
				const comp = comps[i];

				console.log(comp.component);

				if (comp.props && comp.props.label && comp.props.label === label) {
					comp.type.methods.setActive();
				} else {
					comp.type.methods.setInactive();
				}
			}
		},
		onClick: function (tab) {
			this.currentTab = tab;
		}
	},

	mounted: function () {
		this.currentTab = this.labels[0] || "";
	}
};
</script>

<style lang="scss">
.c-tabs {
	margin-bottom: 1rem;

	header {
		margin-bottom: 0.5rem;
		border-bottom: var(--color-bg-3) solid 2px;

		strong {
			position: relative;
			display: inline-block;
			font-weight: 500;
			padding: var(--margin) var(--margin-lg);

			&:after {
			}

			&.active {
				color: var(--color-primary);
			}
		}
	}

	main {
		padding: 0.5rem;
		background-color: var(--color-bg-2);
		border: var(--color-bg-3) solid 1px;
	}
}
</style>
