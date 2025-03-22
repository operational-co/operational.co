<template>
	<div class="c-event-item">
		<Card
			@onEventNameSearch="onEventNameSearch"
			:item="item"
			@onConfirmAction="onConfirmAction"
		></Card>
	</div>
</template>

<script>
import Card from "@operational.co/components/card/index.vue";

export default {
	components: {
		Card,
	},

	props: {
		item: {},
	},

	computed: {
		date: function () {
			let item = this.item;

			if (!item.createdAt) {
				return "no-date";
			}

			return moment(item.createdAt).format("MMM Do, ddd hh:mm a");
		},
	},

	methods: {
		onEventNameSearch: function (name) {
			this.$emit("onEventNameSearch", name);
		},
		onConfirmAction: function (e) {
			this.$emit("onConfirmAction", e);
		},
		isUrl: function (url) {
			try {
				url = new URL(url);
			} catch (_) {
				return false;
			}

			return url.protocol === "http:" || url.protocol === "https:";
		},
	},
};
</script>

<style lang="scss">
.c-event-item {
}
</style>
