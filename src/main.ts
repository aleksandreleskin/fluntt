import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faLongArrowAltLeft,
  faBell,
  faHome,
  faWallet,
  faHistory,
  faSlidersH,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

library.add(faLongArrowAltLeft, faBell, faHome, faWallet, faHistory, faSlidersH);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(store).use(router).mount('#app');
