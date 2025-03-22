<template>
	<div class="c-sidebar">
		<h1 class="fancy">Operational</h1>
		<nav>
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
			<router-link to="/profile">
				<Avatar v-if="user" :size="24" :name="user.email"></Avatar>
				<span> {{ user.firstName }} {{ user.lastName }} </span>
			</router-link>
			<div class="c-sidebar__divider"></div>
			<a href="https://operational.co/api" target="_blank">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M7.92308 6H18M18 6V16.0769M18 6L6 18"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span> API docs </span>
			</a>
			<a href="https://operational.co/manual/introduction" target="_blank">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M7.92308 6H18M18 6V16.0769M18 6L6 18"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>

				<span> Manual </span>
			</a>
			<!-- <router-link to="/crm">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.5457 15.9153C14.2778 15.8481 14.0063 16.0108 13.9391 16.2786C13.8719 16.5465 14.0346 16.8181 14.3024 16.8852L14.5457 15.9153ZM9.69755 16.8852C9.9654 16.8181 10.1281 16.5465 10.0609 16.2786C9.99375 16.0108 9.72216 15.8481 9.45431 15.9153L9.69755 16.8852ZM12 17.6667V17.1667V17.6667ZM21.5 12C21.5 17.2467 17.2467 21.5 12 21.5V22.5C17.799 22.5 22.5 17.799 22.5 12H21.5ZM12 21.5C6.75329 21.5 2.5 17.2467 2.5 12H1.5C1.5 17.799 6.20101 22.5 12 22.5V21.5ZM2.5 12C2.5 6.75329 6.75329 2.5 12 2.5V1.5C6.20101 1.5 1.5 6.20101 1.5 12H2.5ZM12 2.5C17.2467 2.5 21.5 6.75329 21.5 12H22.5C22.5 6.20101 17.799 1.5 12 1.5V2.5ZM17.5 19.5139V20H18.5V19.5139H17.5ZM6.5 20V19.5139H5.5V20H6.5ZM14.3024 16.8852C15.3013 17.1357 16.1194 17.5378 16.6772 18.0141C17.2345 18.4901 17.5 19.0085 17.5 19.5139H18.5C18.5 18.6292 18.0306 17.8549 17.3266 17.2536C16.6229 16.6527 15.6531 16.193 14.5457 15.9153L14.3024 16.8852ZM9.45431 15.9153C8.34692 16.193 7.37709 16.6527 6.67342 17.2536C5.96938 17.8549 5.5 18.6292 5.5 19.5139H6.5C6.5 19.0085 6.76548 18.4901 7.32284 18.0141C7.88059 17.5378 8.69872 17.1357 9.69755 16.8852L9.45431 15.9153ZM12 18.1667C13.5489 18.1667 14.8042 16.9499 15.641 15.3775C16.4924 13.7775 17 11.6615 17 9.53183H16C16 11.5177 15.5237 13.4691 14.7582 14.9077C13.9781 16.3738 12.9834 17.1667 12 17.1667V18.1667ZM17 9.53183C17 7.23445 14.681 5.5 12 5.5V6.5C14.3565 6.5 16 7.98987 16 9.53183H17ZM12 5.5C9.31904 5.5 7 7.23445 7 9.53183H8C8 7.98987 9.64349 6.5 12 6.5V5.5ZM7 9.53183C7 11.6615 7.50759 13.7775 8.35899 15.3775C9.19576 16.9499 10.4511 18.1667 12 18.1667V17.1667C11.0166 17.1667 10.0219 16.3738 9.24178 14.9077C8.47625 13.4691 8 11.5177 8 9.53183H7Z"
            fill="currentColor"
          />
        </svg>

        <span> Users </span>
      </router-link> -->

			<!-- <router-link to="/dashboards">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 4H20M4 4V17H20V4M4 4H22H20M4 4H2M14 20L12.3333 17.5M10 20L11.6667 17.5M12 8V13M8 12V13M16 10V13"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span> Dashboard </span>
      </router-link> -->
			<!-- <a href="#" @click.prevent="$store.user.logout()">
        <span> Logout </span>
      </a> -->
		</nav>
	</div>
</template>

<script>
import Avatar from "vue-boring-avatars";

export default {
	components: {
		Avatar,
	},

	computed: {
		user: function () {
			return this.$store.user.resource;
		},
	},
};
</script>

<style lang="scss">
.c-sidebar {
	position: absolute;
	top: 0;
	right: calc(50% + 354px + 30px);
	width: 240px;
	padding: var(--spacer-sm) 0;

	&__divider {
		margin: var(--margin);
		height: 2px;
		background-color: var(--color-bg-3);
	}

	h1 {
		//font-family: "PP Editorial New";
		font-weight: 500;
		font-stretch: italic;
		margin-bottom: 0;
		//padding: var(--margin-lg) 0;
	}

	nav {
		padding-top: 12px;
		a {
			display: grid;
			grid-template-columns: 16px 1fr;
			align-items: center;
			padding: 4px;
			font-size: var(--font-size);
			font-weight: 500;
			color: var(--color-font);
			border-radius: var(--input-radius);
			transition: all 60ms linear;

			> span {
				padding-left: var(--margin-sm);
			}

			&:hover,
			&:active,
			&:focus {
				background-color: var(--color-bg-4);
			}

			&.router-link-active {
				color: var(--color-link);
			}

			svg {
				width: 16px;
				height: 16px;
				border-radius: 50%;
				overflow: hidden;
			}
		}
	}

	@media screen and (max-width: 1300px) {
		width: 200px;
		right: calc(50% + 354px);
	}
	@media screen and (max-width: 940px) {
		display: none;
	}
}
</style>
