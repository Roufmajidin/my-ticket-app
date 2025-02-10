
<script>
import { ref, onMounted, computed } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  /**
   *
   */
  setup() {
    const baseurl = "http://localhost:4000";
    const movie = ref([]);
    const seats = ref([]);
    const showSeat =async (seat, idWaktu) =>{
    const response = await fetch(`${baseurl}/movies/seats/${seat}/${idWaktu}`);
    const data = await response.json();

    if (data?.data?.seat) {
          seats.value = data.data.seat;
        } else {
          seats.value = [];
        }
    console.log(seat + "," + idWaktu);
    console.log(seats);

    }
    const groupedSeats = computed(() => {
        return seats.value.reduce((acc, seat) => {
          if (!acc[seat.row]) acc[seat.row] = [];
          acc[seat.row].push(seat);
          return acc;
        }, {});
      });
      const formatWIB = (time) => {
        return dayjs.utc(time).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss");
      };



    const fetchmovie = async () => {
      try {
        const response = await fetch(baseurl+"/movies/movies");
        const data = await response.json();
        // users.value = data;
        movie.value = data;
        console.log(movie)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    onMounted(fetchmovie);

    return { movie, formatWIB, showSeat, seats, groupedSeats };
  },
};
</script>

<template>

<div class="hk-pg-wrapper">
            <!-- Breadcrumb -->
            <div class="row">
                    <div class="col-xl-12">
                        <section class="hk-sec-wrapper">
                            <h5 class="hk-sec-title">Movie Bank</h5>
                            <p class="mb-40">Data Movie <a href="https://datatables.net/reference/option/" target="_blank">View all options</a>.</p>
                            <div class="row">
                                <div class="col-sm">
                                    <div class="table-wrap">
                                        <table id="datable_1" class="table table-hover w-100 display pb-30">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Judul</th>
                                                    <th>Office</th>
                                                    <th>Age</th>
                                                    <th>Dimulai</th>
                                                    <th>Duration</th>
                                                    <th>action</th>


                                                </tr>
                                            </thead>
                                            <tbody>
                                              <tr v-for="(item, index) in movie" :key="item.id">
                                                <td>{{ index + 1 }}</td>
                                                <td>{{ item.movies.judul }}</td>
                                                <td>{{ item.movies.genre }}</td>
                                                <td>{{ item.rooms.name }}</td>
                                                <td>{{ new Date(item.time).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) }}</td>
                                                <td>{{ item.movies.durasi }} min</td>
                                                <td>{{ item.movie_id }} min</td>
                                                <td>
                                                  <button type="button"  @click="showSeat(item.room_id, item.id)"  data-toggle="dropdown" class="btn btn-secondary dropdown-toggle" >seat</button>

                                                <div class="dropdown-menu dropdown-authentication">
                                                  <template v-for="(seats, row) in groupedSeats" :key="row">
                                                  <div class="d-flex align-items-center">
                                                    <span class="font-weight-bold me-2" style="margin: 2px">{{ row }} </span>
                                                    <div class="d-flex flex-wrap">
                                                      <button
                                                        v-for="seat in seats"
                                                        :key="seat.id"
                                                        type="button" style="margin: 4px;"
                                                        :class="{
                                                          'btn btn-secondary': seat.Booking.length === 0,
                                                          'btn btn-primary': seat.Booking.length > 0
                                                        }">
                                                        {{ seat.number }}
                                                      </button>
                                                    </div>
                                                        </div>
                                                      </template>
                                                    </div>

                                                </td>
                                              </tr>


                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
              </div>
            <!-- /Container -->

            <!-- Footer -->

</template>

