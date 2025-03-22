<template>
	<div class="c-dashboards">
		<Constrain>
			<h1>Dashboard</h1>
			<!-- <Chart></Chart> -->
		</Constrain>
		<!-- <div class="c-reports__grid">
      <template v-if="items">
        <Widget v-for="(widget, i) in items" :widget="widget" :key="i"></Widget>
      </template>
    </div> -->
		<div class="c-dashboard">
			<div class="grid-stack">
				<div
					v-for="(w, i) in items"
					class="grid-stack-item grid-stack-item-content"
					:data-id="w.id"
					:gs-no-move="true"
					:gs-x="w.x"
					:gs-y="w.y"
					:gs-w="w.w"
					:gs-h="w.h"
					:gs-id="w.id"
					:id="w.id"
					:key="w.id"
				>
					<Widget></Widget>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from "moment";

import Constrain from "@operational.co/components/ui/constrain.vue";

import Widget from "@operational.co/components/widget/index.vue";

import { GridStack, GridStackEngine } from "gridstack";

import "gridstack/dist/gridstack.min.css";

import Chart from "@operational.co/components/chart/index.vue";

export default {
	components: {
		Constrain,
		Widget,
		Chart,
	},

	data: function () {
		return {
			grid: null,
			items: [
				{ id: 1, x: 0, y: 0, w: 2 },
				{ id: 2, x: 0, y: 1, w: 2 },
				{ id: 3, x: 0, y: 2, w: 2 },
			],
			search: {},
		};
	},

	computed: {
		// items: function () {
		//   return this.$store.reports.resources;
		// },
		computedItems: function () {
			return this.items;
		},
	},

	methods: {
		computeHeight: function () {
			let oneWidget = this.$el.querySelector(".c-widget");

			if (!oneWidget) {
				return;
			}

			let height = oneWidget.offsetHeight;

			this.grid.cellHeight(height);
		},
	},

	mounted: function () {
		this.grid = GridStack.init({
			float: false,
			minRow: 1,
			maxRow: 3,
			column: 2,
			disableResize: true,
			cellHeight: "auto",
			cellHeightThrottle: 1000,
		});

		this.$nextTick(() => {
			this.computeHeight();
		});

		// const items = [
		//   { id: 1, x: 1, y: 1, h: 1 },
		//   { id: 2, x: 2, y: 1, w: 1 },
		// ];

		// grid.load(items);
	},
};
</script>

<style lang="scss">
.c-dashboards {
	.c-dashboard {
		width: 720px;
		padding: var(--margin);
		margin: var(--spacer-sm) auto;
		//background-color: var(--color-bg-2);
		border-radius: 20px;
	}

	&__grid {
		max-width: 900px;
		margin-left: auto;
		margin-right: auto;
	}

	.c-constrain {
		&__inner {
			> h1 {
				font-weight: 600;
				margin-bottom: 0;
				user-select: none;
			}
		}
	}

	.grid-stack {
		width: 100%;
	}

	.gs-2 > .grid-stack-item[gs-x="1"] {
		left: 0%;
	}
	.gs-2 > .grid-stack-item[gs-x="1"] {
		left: 50%;
	}

	.gs-2 > .grid-stack-item {
		width: 50%;
	}
	.gs-2 > .grid-stack-item[gs-w="2"] {
		width: 100%;
	}

	.grid-stack-item-content {
		//padding: var(--margin);
		//background-color: #18bc9c;
		//padding: var(--spacer-lg);
		border-radius: var(--border-radius);
		cursor: grab;
	}

	.grid-stack-item {
		&.ui-draggable-dragging {
			.c-widget {
				box-shadow: rgb(0, 0, 0) 0px 8px 30px -10px;
			}
		}
	}

	@media screen and (max-width: 576px) {
		padding-top: var(--margin-lg);

		.c-dashboard {
			padding: 0;
			width: 100%;

			.grid-stack-item {
				padding: 0;
			}
		}
	}
}
</style>
