<template>
  <div class="funnel-container">
    <transition name="fade-in">
      <svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice" v-if="visible">
        <!-- Outer beam (widest, softest background layer) -->
        <polygon
          points="0,60 500,130 1000,60 1000,240 500,170 0,240"
          fill="url(#outerGradient)"
          filter="url(#blurOuter)"
          opacity="0.7"
        />

        <!-- Middle beam  -->
        <polygon
          points="0,90 500,135 1000,90 1000,210 500,165 0,210"
          fill="url(#outerGradient)"
          filter="url(#blur)"
          opacity="1"
        />

        <!-- Inner beam (hot center with two-color gradient) -->
        <polygon
          points="0,120 500,148 1000,120 1000,180 500,152 0,180"
          fill="url(#innerGradient)"
          filter="url(#blurLight)"
          opacity="1"
        />

        <defs>
          <!-- Blurs -->
          <filter id="blurOuter" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <filter id="blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="blurLight" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" />
          </filter>

          <!-- Shared linear gradient for both outer + middle -->
          <linearGradient id="outerGradient" x1="0%" x2="100%">
            <stop offset="0%" stop-color="rgba(255,180,80,1)" />
            <stop offset="45%" stop-color="rgba(255,255,255,0.15)" />
            <stop offset="55%" stop-color="rgba(255,255,255,0.15)" />
            <stop offset="100%" stop-color="rgba(80,180,255,1)" />
          </linearGradient>

          <!-- Inner beam: white core only -->
          <linearGradient id="innerGradient" x1="0%" x2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,1)" />
            <stop offset="35%" stop-color="rgba(255,255,255,1)" />
            <stop offset="40%" stop-color="rgba(255,255,255,0.5)" />
            <stop offset="60%" stop-color="rgba(255,255,255,0.5)" />
            <stop offset="65%" stop-color="rgba(255,255,255,1)" />
            <stop offset="100%" stop-color="rgba(255,255,255,1)" />
          </linearGradient>
        </defs>
      </svg>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const visible = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    visible.value = true;
  });
});
</script>

<style lang="scss">
.funnel-container {
  position: absolute;
  top: calc(20% - 16rem);
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  background: transparent;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Fade-in animation */
  .fade-in-enter-from {
    opacity: 0;
  }
  .fade-in-enter-active {
    transition: opacity 1500ms ease;
  }
  .fade-in-enter-to {
    opacity: 1;
  }

  @media screen and (max-width: 576px) {
    top: 20%;
    svg {
      opacity: 0.75;
    }
  }
}
</style>
