<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { useUsers } from "@/stores/users_controller";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  props: ['id'],
  setup() {
    // console.log("ok")
    // return useUsers;
    const route = useRoute()
    const user = ref([])
    const { getUserId, formatDate } = useUsers();

    onMounted(async () => {
      // return
      user.value = await getUserId(route.params.id)
      console.log("User Data:", user.value); // Debugging

    })

    return { user, formatDate };

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
                      <th>More</th>
                    </tr>
                  </thead>
                  <tbody v-if="user.data_booking != []">

                    <tr v-for="(item, index) in user.data_booking" :key="index">
                      <td>{{ index + 1 }}</td>

                      <td>{{ formatDate(item.booking_date) }}</td>
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
                          <li href="">{{ formatDate(i.waktu.tayang.time) }}</li>

                        </span>
                      </td>
                      <td>sukses</td>

                      <td>
                        <button type="button" class="btn btn-info mr-2" @click="openEditPanel(item, 'tanggal', index)">
                          <i class=" zmdi
                          zmdi-eye font-18"></i>
                        </button>
                      </td>
                    </tr>





                  </tbody>
                  <tbody style="margin-left: 100px;" v-if="user.data_booking == 0">Not yet Bookingan</tbody>

                </table>


              </div>
            </div>
          </div>
        </section>


      </div>
    </div>
  </div>

</template>
