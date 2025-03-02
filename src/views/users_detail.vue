<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { useUsers } from "@/stores/users_controller";
import { onMounted, ref, watchEffect, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import VueQrcode from "@chenfengyuan/vue-qrcode";

export default {
  props: ['id'],
  components: {
    VueQrcode,
  },
  setup() {
    let intervalId;

    // console.log("ok")
    // return useUsers;
    const route = useRoute()
    const user = ref([])
    const { getUserId, formatDate, isPanel, indexing, data, closePanel, openEditPanel, formattgl } = useUsers();

    onMounted(async () => {
      // return
      user.value = await getUserId(route.params.id)
      console.log("User Data:", user.value);
      intervalId = setInterval(async () => {
        user.value = await getUserId(route.params.id);
        // openEditPanel(indexing, user.value.data)
        // closePanel
      }, 2000);


    })
    // 🚀 Watch perubahan `user.value` untuk update panel
    // watchEffect(() => {
    //   if (isPanel.value && user.value.length > 0) {
    //     openEditPanel(indexing.value, user.value);
    //   }
    // });
    onUnmounted(() => {
      clearInterval(intervalId);
    });



    return { user, formatDate, isPanel, indexing, data, closePanel, openEditPanel, formattgl };

  }

};
</script>

<template>
  <div class="container">
    <h2>Detail Pengguna</h2>
    <!-- <p>ID: {{ user }}</p> -->

  </div>
  <div class="hk-pg-wrapper">

    <!-- Breadcrumb -->
    <div class="row">
      <div class="col-xl-12">
        <section class="hk-sec-wrapper">
          <h5 class="hk-sec-title">
            <!-- <span class="subheader">Detail Pengguna {{ user.user?.name }}</span> -->
          </h5>

          <div class="row">
            <div class="col-sm">
              <div class="table-wrap">

                <table id="datable_1" class="table table-hover w-100 display pb-30">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Created</th>
                      <th>Seats</th>
                      <th>Studio</th>
                      <th>payment</th>
                      <!-- <th>Qr</th> -->
                      <th>More</th>
                    </tr>
                  </thead>
                  <tbody v-if="user != []">

                    <tr v-for="(item, index) in user" :key="index">
                      <td>{{ index + 1 }}</td>

                      <td>{{ item.booking_date }}</td>
                      <td>{{ item.bookings.length }} seats</td>
                      <td>{{ item.method.name }}</td>
                      <td>{{ item.order.status == 0 ? "Pending" : "Sukses" }}</td>

                      <!-- <td>
                        <vue-qrcode class="qr-code" v-if="item.qr_code" :value="item.qr_code"
                          :options="{ width: 300, scale: 20, type: 'image/png' }"></vue-qrcode>

                      </td> -->

                      <td>
                        <button type="button" class="btn btn-info mr-2" @click="openEditPanel(index, item)">
                          <i class=" zmdi
                          zmdi-eye font-18"></i>
                        </button>
                      </td>
                    </tr>

                  </tbody>


                  <tbody style="margin-left: 100px;" v-if="user == 0">Not yet Bookingan</tbody>

                </table>
                <!-- open panel pinggir samping-->
                <div class="hk-settings-panel" :class="{ active: isPanel == true }">

                  <div class="nicescsroll-bar">
                    <div class="settings-panel-wrap">
                      <div class="settings-panel-head">
                        <a @click="closePanel" class="settings-panel-close">
                          <span><i data-feather="x"></i>x</span>
                        </a>
                      </div>




                    </div>

                    <!-- side comp -->
                    <div v-if="data.bookings && data.bookings.length > 0" class="booking-container">
                      <div class="qr-container" v-if="data.qr_code">
                        <vue-qrcode class="qr-code" :value="data.qr_code"
                          :options="{ width: 200, scale: 20, type: 'image/png' }"></vue-qrcode>
                      </div>
                      <!-- data.expired harusnya struktur datanya = -->
                      <div v-if="user[indexing].expired == 1" class="booking-content">
                        <h3>Booking Details</h3>
                        <div class="booking-list">
                          <p v-for="(booking, index) in data.bookings" :key="index">
                            {{ booking.number }} {{ booking.row }}
                            <br> id {{ booking.id }}
                            <br>
                            {{ formattgl(booking.waktu.time) }}
                            <br>
                            {{ booking.waktu.movie.judul }}
                            (<span style="font-size:12px">{{ booking.waktu.room.name }}</span>) |
                            <!-- <strong>Price:</strong> {{ booking.waktu.movie.harga }} -->
                            roomid {{ booking.waktu.room.id }}
                            waktuid {{ booking.waktu.id }}
                            <hr>
                          </p>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>
    </div>
  </div>

</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}



.table th {
  background-color: #f8f9fa;
}

.hk-settings-panel {
  position: fixed;
  top: 60px;
  right: -500px;
  width: 500px;
  overflow-y: scroll;
  height: 80%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease-in-out;
  z-index: 1000;
  padding: 20px;

}

.settings-panel-wrap {
  max-height: 100%;
  overflow-y: auto;
}

.hk-settings-panel.active {
  right: 0;
}

.settings-panel-close {
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  font-size: 20px;
}

.booking-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.qr-container {
  flex-shrink: 0;
  /* QR tidak mengecil */
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-code {
  max-width: 200px;
}

.booking-content {
  flex: 1;
}

.booking-list {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}
</style>
