import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import 'semantic-ui-css/semantic.css';    

const app = createApp(App);

app.use(router);

app.use(Vue3Toastify, {
  autoClose: 1500,
  pauseOnHover: false,
  pauseOnFocusLoss: false,
  hideProgressBar: false,
  closeOnClick: true,
  draggable: false,
});

app.mount('#app');