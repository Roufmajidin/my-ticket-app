// import './assets/main.css'

import {
  createApp
} from 'vue'
import {
  createPinia

} from 'pinia'

import App from './App.vue'
import router from './router'
// css c
import '@/assets/dist/css/style.css'
import '@/assets/dist/css/independen.css'
import '@/assets/vendors/datatables.net-dt/css/jquery.dataTables.min.css'
import '@/assets/vendors/datatables.net-responsive-dt/css/responsive.dataTables.min.css'
import '@/assets/vendors/jquery-toggles/css/toggles.css'
// import '@/assets/vendors/jquery-toggles/css/themes/toggles-light.css'
import '@/assets/vendors/jquery-toggles/css/themes/toggles-light.css'
import '@/assets/vendors/jquery-toast-plugin/dist/jquery.toast.min.css'

import {
  io
} from "socket.io-client";
const socket = io("http://localhost:4000"); // Sesuaikan dengan alamat backend

socket.on("connect", () => {
  console.log("Connected to Socket.io server");
});

const loads = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};
const app = createApp(App);

export const piniaInstance = createPinia()
app.config.globalProperties.$socket = socket; // Simpan socket agar bisa diakses di seluruh komponen
// app.use(VueQrcodeReader)

app.use(router);
Promise.all([
  loads('/vendors/jquery/dist/jquery.min.js')
]).then(() => {
  return Promise.all([
    loads('/vendors/jquery/dist/jquery.min.js'),
    loads('/vendors/popper.js/dist/umd/popper.min.js'),
    loads('/vendors/bootstrap/dist/js/bootstrap.min.js'),
    loads('/dist/js/jquery.slimscroll.js'),
    loads('/dist/js/dropdown-bootstrap-extended.js'),
    loads('/dist/js/feather.min.js'),
    loads('/vendors/jquery-toggles/toggles.min.js'),
    loads('/dist/js/toggle-data.js'),
    loads('/vendors/waypoints/lib/jquery.waypoints.min.js'),
    loads('/vendors/jquery.counterup/jquery.counterup.min.js'),
    loads('/vendors/raphael/raphael.min.js'),
    loads('/vendors/morris.js/morris.min.js'),
    loads('/vendors/echarts/dist/echarts-en.min.js'),
    loads('/vendors/jquery.sparkline/dist/jquery.sparkline.min.js'),
    loads('/vendors/vectormap/jquery-jvectormap-2.0.3.min.js'),
    loads('/vendors/vectormap/jquery-jvectormap-world-mill-en.js'),
    loads('/dist/js/vectormap-data.js'),
    loads('/vendors/owl.carousel/dist/owl.carousel.min.js'),
    loads('/vendors/jquery-toast-plugin/dist/jquery.toast.min.js'),
    loads('/dist/js/init.js'),
    loads('/dist/js/dashboard-data.js')
  ]);
}).then(() => {
  console.log('✅ Semua script eksternal telah dimuat!');
  app.mount('#app');
}).catch((error) => {
  console.error('❌ Gagal memuat beberapa script:', error);
});
// app.mount('#app')
