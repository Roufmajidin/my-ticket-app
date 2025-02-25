<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { useUsers } from "@/stores/users_controller";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import VueQrcode from "@chenfengyuan/vue-qrcode";

export default {
  props: ['id'],
  components: {
    VueQrcode,
  },
  setup() {
    // console.log("ok")
    // return useUsers;
    const route = useRoute()
    const user = ref([])
    const { getUserId, formatDate, isPanel, indexing, data, closePanel, openEditPanel, formattgl } = useUsers();

    onMounted(async () => {
      // return
      user.value = await getUserId(route.params.id)
      console.log("User Data:", user.value);

    })

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
            <span class="subheader">Detail Pengguna {{ user.user?.name }}</span>
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
                      <th>Tayang</th>
                      <th>payment</th>
                      <!-- <th>Qr</th> -->
                      <th>More</th>
                    </tr>
                  </thead>
                  <tbody v-if="user.data_booking != []">

                    <tr v-for="(item, index) in user.data_booking" :key="index">
                      <td>{{ index + 1 }}</td>

                      <td>{{ item.booking_date }}</td>
                      <td>
                        <span v-for="(i, idx) in item.bookings" :key="idx">
                          <li href="">{{ i.seat.row }} {{ i.seat.number }}</li>

                        </span>
                      </td>
                      <!-- <td> -->
                      <td>
                        <span v-for="(i, idx) in item.bookings" :key="idx">
                          <li href="">{{ i.waktu.studio.name }}</li>

                        </span>
                      </td>
                      <td>
                        <span v-for="(i, idx) in item.bookings" :key="idx">
                          <li href="">{{ formattgl(i.waktu.tayang.time) }}</li>
                          <!-- <td>
                        <vue-qrcode class="qr-code" v-if="i.qr_code" :value="i.qr_code"
                          :options="{ width: 160 }"></vue-qrcode>
                        <p>{{ i.qr_code }}</p>
                      </td> -->
                        </span>
                      </td>
                      <td>sukses</td>

                      <td>
                        <button type="button" class="btn btn-info mr-2"
                          @click="openEditPanel(index, user.data_booking[index])">
                          <i class=" zmdi
                          zmdi-eye font-18"></i>
                        </button>
                      </td>
                    </tr>

                  </tbody>


                  <tbody style="margin-left: 100px;" v-if="user.data_booking == 0">Not yet Bookingan</tbody>

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


                    <div v-if="data.bookings && data.bookings.length > 0">
                      <div v-for="(booking, index) in data.bookings" :key="index" class="booking-item">
                        <div class="qr-container">
                          <vue-qrcode class="qr-code" v-if="booking.qr_code" :value="booking.qr_code"
                            :options="{ width: 300, scale: 20, type: 'image/png' }"></vue-qrcode>

                        </div>
                        <div class="booking-info">
                          <h3>Booking #{{ index + 1 }}</h3>
                          <p><strong>Dibuat:</strong> {{ formattgl(booking.booking_date) }}</p>
                          <p><strong>Movie Name:</strong> {{ booking.movie.judul }}</p>
                          <p><strong>Harga:</strong> {{ booking.movie.harga }}</p>
                          <p><strong>Method Payment:</strong> {{ booking.method_payment }}</p>
                          <p><strong>Seat:</strong> {{ booking.seat.row }}{{ booking.seat.number }}</p>
                          <p><strong>Tanggal Tayang:</strong> {{ formattgl(booking.waktu.tayang.time) }}</p>


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
  right: -480px;
  width: 480px;
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

/* booking in */
.booking-item {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.qr-container {
  flex: 0 60px;
  margin-right: 15px;
}

.qr-code {
  width: 60px;
  height: 60px;
}

.booking-info {
  flex: 1;
}
</style>
