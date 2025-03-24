import { useMainStore } from "~/store";

import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(async ({ $pinia }) => {
  const store = await useMainStore($pinia);

  await store.init();

  return {
    provide: {
      store: store,
    },
  };
});
