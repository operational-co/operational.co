<template>
	<Modal klass="m-setup" :active="active" :closeable="false">
		<span class="app-version">{{ appVersion }}</span>
		<Constrain size="xs">
			<transition name="slide-fade" mode="out-in">
				<div class="m-setup__card" v-if="currentCard === 'intro'" key="intro">
					<div class="logo">
						<svg
							width="300"
							height="306"
							viewBox="0 0 300 306"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M0 78L144 150V306L0 234V78Z" fill="currentColor" />
							<path
								d="M6 75.0007L150 147.001L144 150L0 78L6 75.0007Z"
								fill="currentColor"
							/>
							<path
								d="M144 150L150 147.001L150 303.001L144 306V150Z"
								fill="currentColor"
							/>
							<path
								d="M150 3.00005L294 75.0001V231L150 159V3.00005Z"
								fill="currentColor"
							/>
							<path
								d="M156 0L300 72L294 75.0001L150 3.00005L156 0Z"
								fill="currentColor"
							/>
							<path
								d="M294 75.0001L300 72L300 228L294 231V75.0001Z"
								fill="currentColor"
							/>
							<path
								d="M78.0001 38.9998L222 111V267L78.0001 195V38.9998Z"
								fill="currentColor"
							/>
							<path
								d="M84.0001 36.0002L228 108L222 111L78.0001 38.9998L84.0001 36.0002Z"
								fill="currentColor"
							/>
							<path
								d="M222 111L228 108L228 264L222 267V111Z"
								fill="currentColor"
							/>
						</svg>
					</div>

					<h2>Welcome to Operational</h2>
					<p>Let's get your Operational instance set up.</p>
					<div class="text-center">
						<button
							type="button"
							class="btn btn-fancy"
							@click="onNext('connection')"
						>
							Get started
						</button>
					</div>
				</div>
				<div
					class="m-setup__card"
					v-else-if="currentCard === 'connection'"
					key="connection"
				>
					<h2 v-if="!connectionStats">Check connection with your backend</h2>
					<div class="text-center">
						<button
							v-if="!connectionStats"
							type="button"
							class="btn btn-fancy"
							@click="checkConnection"
						>
							<span v-if="checking" class="c-spinner"></span>
							Check
						</button>

						<div class="error" v-if="error">
							<p>{{ error }}</p>
							<template
								v-if="error === 'No response received from the server.'"
							>
								<p>This likely means:</p>
								<ul>
									<li>There's a CORS issue</li>
									<li>The server is down</li>
									<li>The server doesn't exist</li>
								</ul>
							</template>
							<template v-if="error === 'Invalid server instance'">
								<p>
									This means you won't be able to the server instance because
									their env variable SELFHOSTED is false or not set.
								</p>
							</template>
							<p>Connection request was made for {{ apiUrl }}</p>
						</div>
					</div>
					<template v-if="connectionStats">
						<p>You can successfully connect to your server!</p>
						<p>
							Your server has {{ connectionStats.ram }} ram and
							{{ connectionStats.availableDiskSpace }} available disk space.
						</p>
						<table border="1">
							<thead>
								<tr>
									<th>Service</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(service, i) in connectionStats.services" :key="i">
									<td>{{ service.name }}</td>
									<td>
										{{ service.type }}
										<small v-if="service.message"
											>({{ service.message }})</small
										>
									</td>
								</tr>
							</tbody>
						</table>
						<p>Let's create your account.</p>
						<div class="text-center">
							<button
								type="button"
								class="btn btn-fancy"
								@click="onNext('setup')"
							>
								Create account
							</button>
						</div>
					</template>
				</div>
				<div
					class="m-setup__card"
					v-else-if="currentCard === 'setup'"
					key="setup"
				>
					<h2>Create your account</h2>
					<FormSetup></FormSetup>
				</div>
			</transition>
		</Constrain>
	</Modal>
</template>

<script>
import Constrain from "@operational.co/components/ui/constrain.vue";
import Modal from "@operational.co/components/ui/modal.vue";
import FormSetup from "@operational.co/components/form/form-setup.vue";
import InputCode from "@operational.co/components/form/input-code.vue";

export default {
	components: {
		Constrain,
		Modal,
		FormSetup,
		InputCode,
	},

	data: function () {
		return {
			currentCard: "intro",
			code: "",

			checking: false,

			connectionStats: null,

			error: "",
		};
	},

	props: {
		active: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		appVersion: function () {
			return __APP_VERSION__;
		},
		apiUrl: function () {
			return this.$store.app.baseApiUrl;
		},
	},

	methods: {
		onResetPasswordRequest: function () {},
		onNext: function (cardName) {
			this.currentCard = cardName;
		},

		async checkConnection() {
			this.checking = true;
			try {
				const connection = await this.$store.app.checkConnection();

				if (connection) {
					this.connectionStats = connection;
				}
				this.error = "";
			} catch (err) {
				console.log(err);

				this.error = err.message || "something went wrong";
			}

			this.checking = false;
		},
	},

	mounted: function () {
		// resolve currentTab here

		let route = this.$route;

		if (route.query && "login" in route.query) {
			this.currentTab = "login";
		} else {
		}

		if (this.active) {
			setTimeout(() => {
				const firstInput = document.querySelector("input");

				if (firstInput) {
					firstInput.focus();
				}
			}, 100);
		}
	},
};
</script>

<style lang="scss">
.m-setup {
	.vfm__content {
		--x-0: 13%;
		--c-0: hsla(227.64705882352914, 3%, 9%, 0.79);
		--y-0: 82%;
		background-color: hsla(219.70588235294136, 3%, 12%, 1);
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 3000 3000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
			radial-gradient(
				circle at var(--x-0) var(--y-0),
				var(--c-0) var(--s-start-0),
				transparent var(--s-end-0)
			);
		animation: hero-gradient-animation 5000ms ease-in-out infinite alternate;
		background-blend-mode: overlay, normal;

		box-shadow:
			rgb(255, 255, 255) 0px 0px 0px 0px,
			rgba(0, 0, 0, 0) 0px 0px 0px 2px,
			rgba(0, 0, 0, 0.5) 0px 0px 0px 0.5px,
			rgba(0, 0, 0, 0.22) 0px 1px 1px -1px,
			rgba(0, 0, 0, 0.22) 0px 2px 2px -1px,
			rgba(255, 255, 255, 0.11) 0px 0.5px 0px 0px inset,
			rgba(255, 255, 255, 0.21) 0px 0px 1px 0px inset,
			rgba(0, 0, 0, 0.16) 0px -6px 12px -4px inset;

		width: 500px;
		min-height: 640px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/*
  Enter and leave animations can use different
  durations and timing functions.
*/
	.slide-fade-enter-active,
	.slide-fade-leave-active {
		transition: all 300ms linear;
	}

	.slide-fade-enter-from,
	.slide-fade-leave-to {
		transform: translateY(-8px);
		opacity: 0;
	}

	.app-version {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		font-family: var(--font-family-monospace);
		font-size: var(--font-size-sm);
		opacity: 0.9;
	}

	.logo {
		text-align: center;

		svg {
			width: 48px;
			height: 48px;
			display: inline-block;
			margin-bottom: 1rem;
		}
	}

	.c-constrain {
		//height: 100%;

		&__inner {
		}
	}

	&__card {
		width: 100%;

		h2,
		p {
			text-align: center;
		}
	}

	.c-form {
		width: 300px;
		//background-color: rgba(0, 0, 0, 0.1);
		//backdrop-filter: blur(4px);
		//padding: var(--spacer);
		//border-radius: 30px;
	}

	.form-control {
		background-color: rgba(0, 0, 0, 0.35);
	}

	.error {
		margin: 1rem 0;
		padding: var(--margin-lg);
		background-color: hsla(var(--hue-red), 0%, 16%, 0.75);
		backdrop-filter: blur(4px);
		border-radius: var(--border-radius);
		text-align: left;
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: var(--color-warning);

		h2,
		p {
			text-align: left;
		}

		p {
			&:last-of-type {
				margin-bottom: 0;
			}
		}
	}

	@media screen and (max-height: 800px) {
		.vfm__content {
			min-height: 88vh;
		}
	}

	@media screen and (max-width: 576px) {
		padding: 0;

		.vfm__content {
			width: 100vw;
			height: 100vh;
			border-radius: 0;
		}
		.form-control {
			min-height: 44px;
			font-size: var(--font-size);
		}
		.btn {
			height: 44px;
		}
	}
}
</style>
