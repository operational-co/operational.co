<template>
	<Popup
		:selector="selector"
		klass="c-popup-menu"
		@onClose="onClose"
		:active="active"
	>
		<div class="c-popup-menu__top">
			<small v-if="user"> {{ user.email }} </small>
		</div>
		<div
			class="c-popup-menu__middle"
			v-if="user.workspaces && user.workspaces.length > 1"
		>
			<span> Projects </span>
			<a
				href="#"
				v-for="workspace in user.workspaces"
				:key="workspace.id"
				@click.prevent="switchWorkspace(workspace)"
			>
				<span>
					{{ workspace.name }}
				</span>
				<strong
					title="Current project"
					v-if="workspace.id === user.primaryWorkspace"
				>
					P
				</strong>
			</a>
			<a href="#" @click.prevent="createWorkspace">
				<span> Create new project </span>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M5 12H12M19 12H12M12 12V5M12 12V19"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</a>
		</div>
		<div class="c-popup-menu__bottom">
			<article v-if="workspace" class="c-popup-menu__usage">
				<h3>
					{{ humanizeNumber(workspace.usedFreeEvents) }} /
					{{ humanizeNumber(workspace.freeEvents) }}
				</h3>
				<span>events so far</span>
			</article>
			<router-link to="/settings">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M9.3 5.7L6.375 5.025L5.025 6.375L5.7 9.3L3 11.1V12.9L5.7 14.7L5.025 17.625L6.375 18.975L9.3 18.3L11.1 21H12.9L14.7 18.3L17.625 18.975L18.975 17.625L18.3 14.7L21 12.9V11.1L18.3 9.3L18.975 6.375L17.625 5.025L14.7 5.7L12.9 3H11.1L9.3 5.7Z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linejoin="round"
					/>
					<path
						d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linejoin="round"
					/>
				</svg>

				<span> Settings</span>
			</router-link>
			<a href="#" @click.prevent="onLogout">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 2V12M16 4.93555C18.9634 6.40825 21 9.46631 21 13C21 17.9706 16.9706 22 12 22C7.02944 22 3 17.9706 3 13C3 9.46631 5.03656 6.40825 8 4.93555"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
				<span> Logout </span>
			</a>
		</div>
	</Popup>
</template>

<script>
import Popup from "@operational.co/components/ui/popup.vue";
import { userApi } from "@/store/user.js";

export default {
	components: {
		Popup,
	},

	data: function () {
		return {
			active: false,
		};
	},

	props: {
		selector: {
			type: String,
			default: "body",
		},
	},

	computed: {
		workspace: function () {
			return this.$store.workspace.resource;
		},
		user: function () {
			return this.$store.user.resource;
		},
		metrics: function () {
			return this.$store.metric.resources;
		},
		lastMetric: function () {
			if (!this.metrics) {
				return;
			}
			return this.metrics[0];
		},
	},

	methods: {
		onLogout: function () {
			this.$store.user.logout();
		},
		onClose: function () {
			this.active = false;
			this.$emit("onClose");
		},
		toggle: function () {
			this.active = !this.active;
		},
		switchWorkspace: function (workspace) {
			this.$store.app.setSwitchWorkspace();
			this.active = false;
			if (workspace.id === this.user.primaryWorkspace) {
				return;
			}

			userApi
				.switchWorkspace({
					newWorkspace: workspace.id,
				})
				.then(() => {
					window.location.reload();
				});
		},
		createWorkspace: function () {
			this.$store.app.setCreateWorkspace(true);
		},
		humanizeNumber: function (number) {
			// Convert number to string
			let strNumber = number.toString();

			// Use regex to add commas every three digits
			strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

			return strNumber;
		},
	},

	mounted: async function () {},
};
</script>

<style lang="scss">
.c-popup-menu {
	min-width: 260px;
	//box-shadow: inset 0 1px 2px hsla(260, 2%, 32%, 0.2), 0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 5px 10px -5px rgba(0, 0, 0, 0.3);
	background-color: var(--color-bg-3);
	box-shadow:
		rgba(0, 0, 0, 0) 0px 0px 0px 0px,
		rgba(0, 0, 0, 0) 0px 0px 0px 0px,
		rgba(0, 0, 0, 0.08) 0px 6px 16px -2px,
		rgba(0, 0, 0, 0.1) 0px 16px 80px -8px;
	.c-arrow {
		color: var(--color-bg-3);
	}

	&__top {
		padding: var(--margin-lg);
		> small {
			display: block;
		}
	}

	&__middle {
		background-color: var(--color-bg-2);
		padding-bottom: var(--margin-sm);
		border-top: var(--color-bg-4) solid 1px;
		border-bottom: var(--color-bg-4) solid 1px;

		> span {
			font-weight: 500;
			font-size: var(--font-size-xs);
			opacity: 0.8;
			padding: var(--margin) var(--margin-lg);
		}

		> a {
			display: flex;
			padding: var(--margin) var(--margin-lg);
			font-size: var(--font-size-sm);
			font-weight: 500;
			color: var(--color-font);

			&:hover,
			&:active,
			&:focus {
				color: Var(--color-font);
				background-color: var(--color-bg-3);
			}

			> strong {
				display: inline-block;
				width: 22px;
				height: 22px;
				margin-left: auto;
				text-align: center;
				line-height: 1.6;
				font-size: var(--font-size-xs);
				background-color: var(--color-primary);
				border-radius: var(--border-radius-sm);
			}

			> svg {
				display: inline-block;
				width: 22px;
				height: 22px;
				margin-left: auto;
				text-align: center;
				padding: var(--margin-sm);
				font-size: var(--font-size-xs);
				background-color: var(--color-bg-4);
				border-radius: var(--border-radius-sm);
			}
		}
	}

	&__bottom {
		padding: var(--margin);
		//background-color: rgba(0, 0, 0, 0.2);

		a {
			width: 100%;
			font-size: var(--font-size-sm);
			display: grid;
			align-items: center;
			grid-template-columns: 24px 1fr;
			grid-column-gap: var(--margin);
			padding: var(--margin);
			color: var(--color-font);
			border-radius: var(--border-radius-sm);
			user-select: none;

			&:not(:last-child) {
				margin-bottom: 4px;
			}

			&:hover,
			&:active {
				background-color: var(--color-bg-5);
			}
		}
	}

	&__usage {
		padding: var(--margin);
		background-color: var(--color-bg-4);
		margin-bottom: var(--margin);
		border-radius: var(--border-radius);
		h3 {
			font-size: var(--font-size-lg);
			font-weight: 300;
			margin-bottom: 0.25rem;
		}

		span {
			font-size: var(--font-size-sm);
		}
	}
}
</style>
