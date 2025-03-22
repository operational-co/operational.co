import { createApp } from "vue";
import App from "./app.vue";
import router from "./router";
import { createPinia } from "pinia";
import pluginPinia from "./lib/plugin-pinia";
import { createVfm } from "vue-final-modal";

const pinia = createPinia();

const app = createApp(App);

const vfm = createVfm();

app.use(vfm);

app.use(pinia);

app.use(pluginPinia);

app.use(router);

app.mount("#app");

if (!navigator.onLine) {
	router.push("/offline"); // Redirect to offline page if not online
}
