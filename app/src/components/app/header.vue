<template>
	<div :class="['c-app-header', { offline: offline === true }]">
		<div class="c-app-header__inner">
			<section>
				<a href="/" class="logo">
					<h1>Operational</h1>
					<span>{{ subtitleText }}</span>
				</a>
				<span class="c-app-header__testmode" v-if="testMode">
					Test mode active
				</span>
			</section>
			<section :class="['c-app-header__menu']">
				<!-- <router-link to="/crm"> Users </router-link> -->
				<router-link to="/"> Events </router-link>
				<router-link to="/settings"> Settings </router-link>
				<router-link to="/playground"> Playground </router-link>
				<router-link to="/docs">Docs</router-link>
				<!-- <a href="#" @click.prevent="onSupport"> Support </a> -->
			</section>

			<section>
				<a
					:class="['popup-menu-button', { active: menuActive === true }]"
					@click.prevent="onMenuOpen"
				>
					<span v-if="workspace"> {{ workspace.name }}</span>
					<Avatar v-if="user && !user.avatar" :size="32" :name="user.email">
					</Avatar>
					<img
						v-if="user && user.avatar"
						class="c-avatar"
						:src="`${assetPath}/${user.avatar}`"
					/>
				</a>

				<PopupMenu
					v-if="init"
					selector=".popup-menu-button"
					ref="PopupMenu"
					@onClose="onMenuClose"
				></PopupMenu>
			</section>
		</div>

		<div :class="['c-app-header__mobile', { active: showNav === true }]">
			<router-link to="/settings">
				<Avatar v-if="user && !user.avatar" :size="24" :name="user.email">
				</Avatar>
				<img
					v-if="user && user.avatar"
					class="c-avatar"
					:src="`${assetPath}/${user.avatar}`"
				/>
				<span v-if="user"> {{ user.firstName }} </span>
			</router-link>

			<router-link to="/">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M5 6H19M7 3H17M5 21H19C20.1046 21 21 20.1046 21 19V11C21 9.89543 20.1046 9 19 9H5C3.89543 9 3 9.89543 3 11V19C3 20.1046 3.89543 21 5 21Z"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>

				<span> Events </span>
			</router-link>

			<router-link to="/docs">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M9 14H13M9 10H15M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>

				<span> Docs </span>
			</router-link>

			<!-- <a href="#" @click.prevent="onSupport">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M9 14H7.25C7.00285 14 6.87928 14 6.75895 14.0097C6.27553 14.0487 5.80877 14.2043 5.39866 14.4631C5.29658 14.5276 5.19772 14.6017 5 14.75V14.75C4.48857 15.1336 4.23286 15.3254 4.03782 15.4003C3.21483 15.7164 2.29801 15.258 2.05709 14.4099C2 14.2089 2 13.8893 2 13.25V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H13.2C14.8802 2 15.7202 2 16.362 2.32698C16.9265 2.6146 17.3854 3.07354 17.673 3.63803C18 4.27976 18 5.11984 18 6.8V7V7.5M20.0909 21.1818V21.1818C20.8103 21.8669 22 21.357 22 20.3636V13.2C22 12.0799 22 11.5198 21.782 11.092C21.5903 10.7157 21.2843 10.4097 20.908 10.218C20.4802 10 19.9201 10 18.8 10H12.2C11.0799 10 10.5198 10 10.092 10.218C9.71569 10.4097 9.40973 10.7157 9.21799 11.092C9 11.5198 9 12.0799 9 13.2V16.9429C9 18.063 9 18.623 9.21799 19.0508C9.40973 19.4272 9.71569 19.7331 10.092 19.9249C10.5198 20.1429 11.0799 20.1429 12.2 20.1429H17.4935C18.4606 20.1429 19.3906 20.5149 20.0909 21.1818Z"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>

				<span>Support</span>
			</a> -->
		</div>
	</div>
</template>

<script>
import PopupMenu from "./popup-menu.vue";
import Constrain from "@operational.co/components/ui/constrain.vue";

import Avatar from "vue-boring-avatars";

export default {
	components: {
		PopupMenu,
		Constrain,
		Avatar,
	},

	data: function () {
		return {
			init: false,
			menuActive: false,

			lastScrollPosition: 0,
			showNav: true,
		};
	},

	computed: {
		baseApiUrl: function () {
			return this.$store.app.baseApiUrl;
		},
		appVersion: function () {
			return __APP_VERSION__;
		},
		isSelfHosted: function () {
			return this.$store.app.isSelfHosted;
		},
		subtitleText: function () {
			if (this.isSelfHosted) {
				return `Self-hosted ${this.appVersion}`;
			} else {
				return "Beta";
			}
		},
		testMode: function () {
			return this.$store.app.testMode;
		},
		offline: function () {
			return this.$store.app.offline;
		},
		user: function () {
			return this.$store.user.resource;
		},
		workspace: function () {
			return this.$store.workspace.resource;
		},
		baseApiUrl: function () {
			return this.$store.app.baseApiUrl;
		},
		assetPath: function () {
			let baseUrl = this.baseApiUrl;
			return `${baseUrl}/uploads`;
		},
	},

	methods: {
		onDocs: function () {
			this.$store.app.showDocs();
		},
		onSupport: function () {
			$crisp.push(["do", "chat:show"]);
			$crisp.push(["do", "chat:open"]);
		},
		onMenuClose: function () {
			this.menuActive = false;
		},
		logout: function () {
			this.$store.user.logout();
		},
		onMenuOpen: function () {
			this.menuActive = true;
			this.$refs.PopupMenu.toggle();
		},
		handleScroll() {
			const currentScrollPosition = window.scrollY;
			if (
				currentScrollPosition > this.lastScrollPosition &&
				currentScrollPosition > 100
			) {
				// User is scrolling down
				this.showNav = false;
			} else {
				// User is scrolling up or at the top
				this.showNav = true;
			}
			this.lastScrollPosition = currentScrollPosition;
		},
		addEventListeners: function () {
			window.addEventListener("scroll", this.handleScroll);
		},
		removeEventListeners: function () {
			window.removeEventListener("scroll", this.handleScroll);
		},
	},

	mounted: function () {
		this.init = true;

		this.addEventListeners();
	},

	beforeUnmount: function () {
		this.removeEventListeners();
	},
};
</script>

<style lang="scss">
.c-app-header {
	width: 100%;
	height: 56px;

	.c-avatar {
		width: 32px;
		height: 32px;
		border-radius: 99px;
		object-fit: cover;
		object-position: center center;
	}

	&__testmode {
		display: inline-block;
		padding: var(--margin) var(--margin-lg);
		margin-left: var(--margin-lg);
		background-color: var(--color-bg-3);
		border-radius: var(--border-radius);
		font-family: var(--font-family-monospace);
		font-weight: 400;
		font-size: var(--font-size-sm);
		line-height: 1;
	}

	&__inner {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 1;

		> section {
			padding: var(--margin) var(--margin-lg);

			&:first-child {
				position: absolute;
				top: 0;
				left: 0;
				height: 100%;
			}

			&:nth-child(2) {
				position: absolute;
				top: 0;
				left: 50%;
				height: 100%;
				transform: translateX(-50%);
			}

			&:last-child {
				position: absolute;
				top: 0;
				right: 0;
				height: 100%;
			}
		}

		.c-constrain {
			flex-grow: 1;
		}

		.logo {
			position: relative;
			margin-right: auto;

			display: flex;
			align-items: center;

			h1 {
				display: inline-block;
				padding: var(--margin);
				font-size: var(--font-size-lg);
				margin: 0;
				color: var(--color-font);
				transition: all var(--transition-time) linear;

				&:hover,
				&:active {
					color: var(--color-primary-light);
				}
			}

			span {
				display: inline-block;
				padding: var(--margin-sm) var(--margin);
				margin-left: var(--margin);
				font-size: var(--font-size-xs);
				font-weight: 600;
				font-family: var(--font-family-monospace);
				line-height: 1;
				color: var(--color-font-light);
				background-color: var(--color-bg-2);
				border-radius: var(--border-radius);
			}
		}

		> a {
			user-select: none;
			cursor: pointer;
		}

		.popup-menu-button {
			position: relative;
			max-width: 160px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 99px;
			margin-right: 0;
			padding: var(--margin) var(--margin-lg);
			padding-right: var(--margin);
			background-color: var(--color-bg-3);
			color: var(--color-font);
			transition: all var(--transition-time-sm) linear;
			cursor: pointer;

			> span {
				display: inline-block;
				margin-right: var(--margin);
				font-weight: 500;
				pointer-events: none;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				user-select: none;
			}

			> .c-avatar {
				user-select: none;
			}

			> svg {
				min-width: 32px;
			}

			&:hover,
			&:active,
			&.active {
				background-color: var(--color-primary-dark);
				color: var(--color-primary);
			}
		}
	}

	&__menu {
		display: flex;
		justify-content: center;
		align-items: center;

		a {
			height: 32px;
			position: relative;
			display: inline-flex;
			align-items: center;
			margin: 0 var(--margin);
			padding: var(--margin) var(--spacer-sm);
			color: var(--color-font);
			transition: var(--transition);
			font-weight: 500;
			//background-color: var(--color-bg-3);
			border-radius: var(--border-radius);
			user-select: none;
			line-height: 1rem;

			&:hover,
			&:active,
			&:focus {
				outline: none;
				background-color: var(--color-bg-3);
				color: var(--color-link-hover);
			}

			&.router-link-active {
				color: var(--color-link-hover);
				background-color: var(--color-bg-3);
				//background-color: var(--color-primary);
			}
		}
	}

	&__mobile {
		display: none;
	}

	&.offline {
		.c-app-header__menu a,
		.popup-menu-button,
		.c-app-header__mobile a {
			opacity: 0.75;
			pointer-events: none;
		}
	}

	@media screen and (max-width: 940px) {
		display: block;
		position: fixed;
		z-index: 2;
		bottom: 0;
		left: 0;
		width: 100%;
		padding-top: 0;

		.c-avatar {
			width: 24px;
			height: 24px;
		}

		.c-constrain__inner {
			padding: 0;
		}

		&__inner {
			display: none;
			border-radius: 0;
		}

		&__mobile {
			width: 100%;
			display: flex;
			justify-content: space-evenly;
			background-color: var(--color-bg-1);
			border-top: var(--color-bg-3) solid 1px;
			//background-color: hsla(206, 8%, 20%, 0.75);
			backdrop-filter: blur(4px);
			-webkit-backdrop-filter: blur(4px);
			padding: var(--margin) var(--margin-lg);
			transform: translateY(100%);
			transition: transform var(--transition-time) ease-out;

			&.active {
				transform: translateY(0%);
			}

			> a {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: var(--color-font);
				min-width: 63px;
				font-weight: 500;

				&:first-child {
					> svg {
						border-radius: 99px;
					}
				}

				> svg {
					width: 24px;
					height: 24px;
				}

				> span {
					display: inline-block;
					margin-top: var(--margin-sm);
					font-size: var(--font-size-xs);
					font-weight: 500;
				}

				&.router-link-active,
				&:active,
				&:focus {
					outline: none;
					color: var(--color-primary-light);
				}
			}
		}
	}

	@supports (-webkit-touch-callout: none) {
		&__mobile {
			padding-bottom: var(--spacer);
		}
	}
}

.is-ios .c-app-header {
	height: 76px;
}
</style>
