import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";
import router from "./router";

const a = createApp(App);
a.use(router);
a.mount("#app");
