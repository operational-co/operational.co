// src/directives/tooltip.js
import { createPopper } from "@popperjs/core";

export default {
  beforeMount(el, binding) {
    // Tooltip content
    const text = binding.value;

    // Create tooltip element
    const tooltip = document.createElement("div");
    tooltip.className = "v-tooltip";
    tooltip.textContent = text;
    Object.assign(tooltip.style, {
      backgroundColor: "rgba(20,20,20,0.3)",
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "500",
      lineHeight: "1.4",
      zIndex: "9999",
      pointerEvents: "none",
      visibility: "hidden",
      backdropFilter: "blur(2px)",
      opacity: "0",
      transition: "opacity 300ms"
    });
    document.body.querySelector("#app").appendChild(tooltip);

    // Create popper instance
    const popperInstance = createPopper(el, tooltip, {
      placement: "top",
      modifiers: [{ name: "offset", options: { offset: [0, 6] } }]
    });

    // Show/hide handlers
    const show = () => {
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = "1";
      popperInstance.update();
    };
    const hide = () => {
      tooltip.style.opacity = "0";
      tooltip.style.visibility = "hidden";
    };

    // Store references on element
    el._tooltip = { tooltip, popperInstance, show, hide };

    // Event listeners
    el.addEventListener("mouseenter", show);
    el.addEventListener("mouseleave", hide);
    el.addEventListener("focus", show);
    el.addEventListener("blur", hide);
  },
  updated(el, binding) {
    // Update tooltip text if it changes
    if (binding.value !== binding.oldValue && el._tooltip) {
      el._tooltip.tooltip.textContent = binding.value;
      el._tooltip.popperInstance.update();
    }
  },
  unmounted(el) {
    if (!el._tooltip) return;
    const { tooltip, popperInstance, show, hide } = el._tooltip;

    // Remove event listeners
    el.removeEventListener("mouseenter", show);
    el.removeEventListener("mouseleave", hide);
    el.removeEventListener("focus", show);
    el.removeEventListener("blur", hide);

    // Cleanup
    popperInstance.destroy();
    document.body.removeChild(tooltip);
    delete el._tooltip;
  }
};

// Usage in main.js
// import { createApp } from 'vue';
// import App from './App.vue';
// import tooltipDirective from './directives/tooltip';
//
// const app = createApp(App);
// app.directive('tooltip', tooltipDirective);
// app.mount('#app');
