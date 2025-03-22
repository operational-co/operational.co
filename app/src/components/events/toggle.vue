<template>
	<div
		:class="['c-events-toggle', { active: listening === true }]"
		@click="onToggle"
	>
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				class="progress-ring"
				cx="12"
				cy="12"
				r="10"
				fill="none"
				stroke="currentColor"
				stroke-width="4"
				stroke-linecap="round"
				:stroke-dasharray="circumference"
				:stroke-dashoffset="strokeDashOffset"
			/>

			<!-- Main Icon (Play/Pause) -->
			<transition name="fade-scale" mode="in-out">
				<g v-if="!listening" key="play-icon">
					<path
						d="M10 14.8039V9.19607C10 8.79436 10.4498 8.55666 10.7817 8.78296L14.8941 11.5869C15.1852 11.7854 15.1852 12.2146 14.8941 12.4131L10.7817 15.217C10.4498 15.4433 10 15.2056 10 14.8039Z"
						fill="currentColor"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
						fill="currentColor"
					/>
				</g>
				<g v-else key="stop-icon">
					<path
						d="M9.5 10.5C9.5 9.94772 9.94772 9.5 10.5 9.5H13.5C14.0523 9.5 14.5 9.94772 14.5 10.5V13.5C14.5 14.0523 14.0523 14.5 13.5 14.5H10.5C9.94772 14.5 9.5 14.0523 9.5 13.5V10.5Z"
						fill="currentColor"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
						fill="currentColor"
					/>
				</g>
			</transition>
		</svg>

		<!--
		<transition name="fade-scale">
			<svg
				v-if="!listening"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.7817 8.78296C10.4498 8.55666 10 8.79436 10 9.19607V14.8039C10 15.2056 10.4498 15.4433 10.7817 15.217L14.8941 12.4131C15.1852 12.2146 15.1852 11.7854 14.8941 11.5869L10.7817 8.78296Z"
					fill="currentColor"
				/>
			</svg>

			<svg
				v-else
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M9.5 10.5C9.5 9.94772 9.94772 9.5 10.5 9.5H13.5C14.0523 9.5 14.5 9.94772 14.5 10.5V13.5C14.5 14.0523 14.0523 14.5 13.5 14.5H10.5C9.94772 14.5 9.5 14.0523 9.5 13.5V10.5Z"
					fill="currentColor"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
					fill="currentColor"
				/>
			</svg>
		</transition>
		--></div>
</template>

<script>
export default {
	data: function () {
		return {
			timer: null,
			duration: 6000,
			elapsedTime: 0,

			circumference: 2 * Math.PI * 10, // Circle radius = 10
		};
	},

	props: {
		listening: {},
	},

	watch: {
		listening(newVal) {
			if (!newVal) {
				// If listening is false, start the timer
				this.startTimer();
			} else {
				// If listening becomes true, clear any active timer
				this.clearTimer();
			}
		},
	},

	computed: {
		strokeDashOffset() {
			const progress = this.elapsedTime / this.duration;
			return this.circumference * (1 - progress);
		},
	},

	methods: {
		onToggle: function () {
			this.$emit("onToggle");
		},
		startTimer() {
			this.clearTimer(); // Clear previous timer
			this.elapsedTime = 0;

			// Start interval to track progress
			this.interval = setInterval(() => {
				if (this.elapsedTime >= this.duration) {
					this.clearTimer();
					this.$emit("onToggle", true);
				} else {
					this.elapsedTime += 100; // Update every 100ms
				}
			}, 100);
		},

		clearTimer() {
			if (this.interval) {
				clearInterval(this.interval);
				this.interval = null;
			}
			this.elapsedTime = 0;
		},
	},

	beforeDestroy() {
		this.clearTimer(); // Ensure the timer is cleared when the component is destroyed
	},
};
</script>

<style lang="scss">
.c-events-toggle {
	position: relative;
	margin-left: var(--margin);

	width: 24px;
	height: 24px;
	cursor: pointer;
	margin-left: var(--margin);
	user-select: none;

	.fade-scale-enter-active,
	.fade-scale-leave-active {
		position: absolute;
		transition: all var(--transition-time) linear;
	}

	.fade-scale-enter {
		opacity: 0;
	}

	.fade-scale-enter-to {
		opacity: 1;
	}

	.fade-scale-leave {
		opacity: 1;
	}

	.fade-scale-leave-to {
		opacity: 0;
	}

	.progress-ring {
		color: var(--color-warning);
		transition: stroke-dashoffset 0.1s linear;
		transform: rotate(-90deg);
		transform-origin: center;
	}

	svg {
		display: inline-block;
	}

	&:hover,
	&:active {
		transition: transform 120ms linear;

		&:active {
			transform: scale(0.8);
		}
	}
	&.active {
		color: var(--color-warning);
	}
}
</style>
