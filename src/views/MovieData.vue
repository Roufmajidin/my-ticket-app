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
    const isPanelOpen = ref(false);

    const selectedMovie = ref({ movie_name: '', genre: '', studio: '', dimulai: '', durasi: '' });
    const openEditPanel = (movie) => {
      selectedMovie.value = {
        movie_name: movie.movies.judul,
        genre: movie.movies.genre,
        studio: movie.rooms.name,
        dimulai: new Date(movie.time).toISOString().slice(0, 16),
        durasi: movie.movies.durasi,
      };
      isPanelOpen.value = true;
      console.log(selectedMovie.value)
    };

    const closeEditPanel = () => {
      isPanelOpen.value = false;
    };

    const saveChanges = () => {
      console.log('Updated Movie:', selectedMovie.value);
      closeEditPanel();
    };

    const showSeat = async (seat, idWaktu) => {
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
        const response = await fetch(baseurl + "/movies/movies");
        const data = await response.json();
        // users.value = data;
        movie.value = data;
        console.log(movie)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    onMounted(() => {
      fetchmovie()
      // openEditPanel()

    })

    return { movie, formatWIB, showSeat, seats, groupedSeats, openEditPanel, closeEditPanel, isPanelOpen, selectedMovie };
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
          <p class="mb-40">Data Movie <a href="https://datatables.net/reference/option/" target="_blank">View all
              options</a>.</p>
          <div class="row">
            <div class="col-sm">
              <div class="table-wrap">
                <table id="datable_1" class="table table-hover w-100 display pb-30">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Judul</th>
                      <th>Genre</th>
                      <th>Studio</th>
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
                      <td>{{ new Date(item.time).toISOString().slice(0, 16) }}</td>
                      <td>{{ item.movies.durasi }} min</td>

                      <td>
                        <button type="button" class="btn btn-success mr-2" @click="openEditPanel(item)">

                          <i class="zmdi zmdi-edit"></i></button>
                        <!-- Setting Panel -->

                        <button type="button" @click="showSeat(item.room_id, item.id)" data-toggle="dropdown"
                          class="btn btn-secondary dropdown-toggle">seat</button>

                        <div class="dropdown-menu dropdown-authentication">
                          <template v-for="(seats, row) in groupedSeats" :key="row">
                            <div class="d-flex align-items-center">
                              <span class="font-weight-bold me-2" style="margin: 2px">{{ row }} </span>
                              <div class="d-flex flex-wrap">
                                <button v-for="seat in seats" :key="seat.id" type="button" style="margin: 4px;" :class="{
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
                <div class="hk-settings-panel" :class="{ active: isPanelOpen }">
                  <div class="nicescroll-bar position-relative">
                    <div class="settings-panel-wrap">
                      <div class="settings-panel-head">
                        <a @click="closeEditPanel" class="settings-panel-close">
                          <span><i data-feather="x"></i>x</span>
                        </a>
                      </div>
                      <hr>

                      <h6 class="mb-5">Edit Movie</h6>
                      <p class="font-14">Menu comes in two modes: dark & light</p>
                      <form>
                        <div class="form-group">
                          <label>movie name</label>
                          <input type="text" class="form-control" v-model="selectedMovie.movie_name">
                        </div>
                        <div class="form-group">
                          <label>genre</label>
                          <input type="text" class="form-control" v-model="selectedMovie.genre">
                        </div>
                        <div class="form-group">
                          <label>studio</label>
                          <input type="text" class="form-control" v-model="selectedMovie.studio">
                        </div>
                        <div class="form-group">
                          <label>durasi</label>
                          <input type="text" class="form-control" v-model="selectedMovie.durasi">
                        </div>

                        <div class="form-group">
                          <label>Dimulai</label>
                          <input type="datetime-local" class="form-control" v-model="selectedMovie.dimulai">
                        </div>

                      </form>
                      <hr>

                      <button id="reset_settings" class="btn btn-primary btn-block btn-reset mt-30">simpan edit
                      </button>
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

  <!-- /Container -->

  <!-- Footer -->

</template>
<style scoped>
/* Styling untuk tabel */
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
  right: -350px;
  width: 350px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease-in-out;
  z-index: 1000;
  padding: 20px;
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
</style>
