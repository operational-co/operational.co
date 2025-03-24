<template>
	<div class="c-events-categories">
		<h3>Categories</h3>
		<a
			href="#"
			v-for="(category, i) in categories"
			:key="i"
			@click.prevent="onClick(category.text)"
			:class="[{ active: currentCategory === category.text }]"
		>
			{{ category.text }}
		</a>
	</div>
</template>

<script>
export default {
	data: function () {
		return {
			currentCategory: "",
		};
	},

	computed: {
		workspace: function () {
			return this.$store.workspace.resource;
		},
		categories: function () {
			if (!this.workspace) {
				return [];
			}
			let categories = this.workspace.categories || [];
			return categories;
		},
	},

	methods: {
		onClick: function (e) {
			if (this.currentCategory === e) {
				this.currentCategory = "";
				this.$emit("onClick", "");
			} else {
				this.currentCategory = e;
				this.$emit("onClick", e);
			}
		},
	},
};
</script>

<style lang="scss">
.c-events-categories {
	position: absolute;
	top: calc(32px + var(--margin-lg));
	left: 100%;
	width: 200px;

	a {
		display: block;
		padding: var(--margin-lg) var(--margin-lg);
		background-color: var(--color-bg-2);
		border-radius: var(--input-radius);
		color: var(--color-font-light);
		font-weight: 500;
		line-height: 1;

		&:not(:last-child) {
			margin-bottom: var(--margin);
		}

		&:hover {
			background-color: var(--color-bg-3);
		}

		&.active {
			color: var(--color-font);
			background-color: var(--color-primary);
		}
	}

	@media screen and (max-width: 1170px) {
		display: none;
	}
}
</style>
