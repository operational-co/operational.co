<template>
	<div :class="['c-playground-item', { active: active === true }]" @click="onClick">
		<strong>{{ example.item.avatar }} {{ example.title }} </strong>
		<p>
			{{ example.description }}
		</p>
	</div>
</template>

<script>
export default {
	components: {},

	data: function () {
		return {};
	},

	props: {
		example: {},
		active: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		onClick: function () {
			this.$emit("onClick", this.example);
		}
	}
};
</script>

<style lang="scss">
.c-playground-item {
	padding: var(--margin);
	background-color: var(--color-bg-4);
	border-radius: var(--border-radius);
	margin-bottom: var(--margin);

	font-size: var(--font-size-sm);
	line-height: 1.4;

	cursor: pointer;

	transition: all var(--transition-time) linear;

	&:last-child {
		margin-bottom: 0;
	}

	strong {
		display: block;
		//margin-bottom: 0.25rem;
	}

	p {
		display: none;
		margin: 0;
		opacity: 0.75;
		transition: all var(--transition-time) linear;
	}

	&.active {
		background-color: var(--color-primary);

		p {
			opacity: 1;
		}
	}

	&:hover,
	&:active {
		p {
			opacity: 1;
		}
	}
}
</style>
