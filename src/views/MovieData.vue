<script>
import { ref, onMounted, computed } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { useMovie } from "@/stores/movie_controller";

export default {
  setup() {
    return useMovie();
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
                <button id="" v-on:click="addMovie()" class="btn btn-primary mt-30">Add movie data
                </button>
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


                    <tr v-for="(item, index) in movie" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ item.movies?.judul }}</td>
                      <td>{{ item.movies?.genre }}</td>
                      <td>
                        <!-- {{ new Date(item.time).toISOString().slice(0, 16) }} -->
                        <ul>
                          <li v-for="w in item.waktu" :key="w.id">
                            <h6>{{ formatWIB(w.waktu) }}
                              <!-- - Room ID: {{ w.room_id }} -->

                            </h6>
                            <h5> {{ w.studio }} <span style="color: green; font-size: 16px;">({{ w.status == 1 ?
                              "Selesai" :
                              "Berlangsung" }})</span></h5>
                          </li>


                        </ul>
                      </td>
                      <td>{{ item.movies.durasi }} min</td>

                      <td>
                        <button type="button" class="btn btn-success mr-2" @click="openEditPanel(item)">

                          <i class="zmdi zmdi-edit"></i></button>
                        <!-- Setting Panel -->

                        <!-- showSeat(item.room_id, item.id) -->
                        <button type="button" @click="showPanel(item.waktu)"
                          class="btn btn-secondary dropdown-toggle">seat</button>


                      </td>
                    </tr>


                  </tbody>

                </table>
                <div class="hk-settings-panel" :class="{ active: isPanelOpen ?? isPanelOpenSeat }">

                  <div class="nicescsroll-bar">
                    <div class="settings-panel-wrap">
                      <div class="settings-panel-head">
                        <a @click="closeEditPanel" class="settings-panel-close">
                          <span><i data-feather="x"></i>x</span>
                        </a>
                      </div>

                      <p class="font-14">
                        {{ panelModel === "seat" ? "Seats Bangku" : modeForm === 'add' ? "Tambah Movie" : "Detail Movie"
                        }}
                      </p>
                      <div class="fm" v-if="panelModel === 'detail'">
                        <form class="nicescroll-bar">
                          <div class="form-group">
                            <label>movie name</label>
                            <input type="text" class="form-control" v-model="selectedMovie.movie_name">
                          </div>
                          <div class="form-group">
                            <label>tahun</label>
                            <input type="text" class="form-control" v-model="selectedMovie.tahun">
                          </div>
                          <div class="form-group">
                            <label>sinopsis</label>
                            <input type="text" class="form-control" v-model="selectedMovie.sinopsis">
                          </div>
                          <div class="form-group">
                            <label>genre</label>
                            <input type="text" class="form-control" v-model="selectedMovie.actor_u">
                          </div>
                          <div class="form-group">
                            <label>actor utama</label>
                            <input type="text" class="form-control" v-model="selectedMovie.genre">
                          </div>
                          <div class="form-group">
                            <label>studio</label>

                            <!-- <select v-if="modeForm === 'add'" class="form-control" v-model="selectedMovie.studio">

                              <option v-for="studio in canSeat" :key="studio.id" :value="studio.name"
                                :disabled="studio.can_generate_seat">
                                {{ studio.name }}
                                {{ studio.can_generate_seat != true ? '(Sudah terisi movie)' : '' }}
                              </option>
                            </select> -->



                            <!-- Jika mode edit, tampilkan input text -->
                            <!-- <input v-else type="text" class="form-control" v-model="selectedMovie.studio"> -->
                            <div class="d-flex align-items-center flex-wrap" v-if="selectedMovie.studio.length">
                              <div v-for="(studio, index) in selectedMovie.studio" :key="index"
                                class="d-flex align-items-center m-2">

                                <!-- Tombol Studio -->
                                <button class="btn btn-primary me-2">
                                  {{ studio.nameStudio }}
                                </button>

                                <div class="custom-control custom-checkbox">
                                  <input type="checkbox" class="custom-control-input" :id="'customCheck' + index"
                                    @click="toggleStudioSelection(studio.id, movie)"
                                    :checked="studio.status === 1 || selectedMovie.selectedStudios.includes(studio.id)">

                                  <label class="custom-control-label" :for="'customCheck' + index">
                                    {{ studio.status == 0 ? "selesai" : "Idle" }}
                                  </label>
                                </div>

                              </div>
                            </div>


                            <p>Selected Studios: {{ selectedMovie.selectedStudios }}</p>
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

                      <div class="seats" v-else>
                        <!-- TGL TANGGAL -->
                        <div class="date-buttons">
                          <button v-for="(seats, date) in allSeatInData" :key="date"
                            @click="setSelectedDate(date, seats.room_id, seats.id)"
                            :class="{ 'btn btn-primary': selectedDate === date, 'btn btn-secondary': selectedDate !== date }"
                            class="btn" style="margin: 2px">
                            {{ formatWIB(seats.waktu) }}
                          </button>
                        </div>
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
</style>
