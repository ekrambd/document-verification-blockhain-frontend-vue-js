import { createApp } from 'vue';
import App from './App.vue';
import router from './routes.js';
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";

import store from './store/index.js'
import walletPlugin from './plugins/wallet.js';


const app = createApp(App);
app.use(router);
app.use(store);
app.use(walletPlugin);
app.use(VueToast,{
	position: 'top-right',
	duration: 1000,
});

app.mount('#app');
