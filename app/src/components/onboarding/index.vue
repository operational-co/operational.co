<template>
	<div class="c-onboarding">
		<component :is="resolveStep(currentStep)" @onNext="onNext"></component>
		<div class="c-onboarding__flags">
			<span
				v-for="(step, i) in steps"
				:key="i"
				:class="[{ active: step === currentStep }]"
			>
			</span>
		</div>
	</div>
</template>

<script>
import Activation from "./activation.vue";
import Intro from "./intro.vue";
import Apikey from "./apikey.vue";
import Notification from "./notification.vue";
import Event from "./event.vue";
import Event2 from "./event2.vue";
import Project from "./project.vue";
import Stats from "./stats.vue";
import Support from "./support.vue";
import Outro from "./outro.vue";

import Setup from "./setup.vue";
import Setup2 from "./setup2.vue";

export default {
	components: {
		Activation,
		Intro,
		Apikey,
		Notification,
		Event,
		Event2,
		Project,
		Stats,
		Support,
		Outro,

		Setup,
		Setup2,
	},

	data: function () {
		return {
			currentStep: "intro",
			steps: [
				"activation",
				"intro",
				"project",
				"stats",
				//"apikey",
				//"event",
				//"event2",s
				//"notification",
				//"support",
				//"outro",
			],

			setupSetups: ["setup", "setup2"],
		};
	},

	computed: {
		user: function () {
			return this.$store.user.resource;
		},
		isSelfHosted: function () {
			const condition = this.$store.app.isSelfHosted;
			return condition;
		},
	},

	methods: {
		async updateUser(step) {
			let form = {
				onboardingStep: step,
			};

			let user = await this.$store.user.update(form);
		},
		resolveStep: function (step) {
			return step.toLowerCase();
		},
		onNext: function () {
			let newStep = null;
			let steps = this.steps;
			if (this.isSelfHosted) {
				steps = this.setupSetups;
			}
			let i = steps.indexOf(this.currentStep);

			if (i !== -1) {
				newStep = steps[i + 1];

				if (!newStep) {
					//this.$store.app.sendNotification(`You're onboarded`);
					this.$store.app.stopOnboarding();
					this.$store.user.finishOnboarding();
					return;
					// close onboarding
				}

				this.currentStep = newStep;

				this.updateUser(newStep);
			}
		},
	},

	mounted: function () {
		let onboardingStep = this.user.onboardingStep;

		let steps = this.steps;
		if (this.isSelfHosted) {
			steps = this.setupSetups;
		}

		// If user hasn't been activated, force them to finish their activation
		if (!this.user.activated) {
			onboardingStep = "activation";
		}

		if (onboardingStep) {
			let i = steps.indexOf(onboardingStep);

			if (i >= 0) {
				this.currentStep = steps[i];
			}
		}
	},
};
</script>

<style lang="scss">
.c-onboarding {
	height: calc(100vh - 8rem);
	position: relative;
	overflow-y: auto;

	code.one-line {
		border-radius: var(--border-radius);
		font-size: var(--font-size-sm);
		background-color: var(--color-bg-3);
	}

	> div {
		min-height: 100%;
		padding: 2rem;
		display: flex;
		align-items: center;
	}

	.c-constrain {
		height: 100%;
		width: 100%;

		&__inner {
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			> article {
				width: 100%;
			}
		}
	}

	&__flags {
		position: absolute;
		bottom: 0;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
		height: auto !important;
		min-height: initial !important;
		padding: var(--margin-lg);

		display: grid;
		grid-auto-rows: 1fr;
		grid-auto-flow: column;
		grid-column-gap: var(--margin);

		span {
			width: 32px;
			height: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: var(--color-bg-4);
			border-radius: 99px;
			opacity: 0.5;
			user-select: none;

			&.active {
				opacity: 1;
				background-color: var(--color-bg-5);
			}
		}
	}
}
</style>
