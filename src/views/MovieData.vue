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

                        <button type="button" @click="showSeat(item.room_id, item.id)"
                          class="btn btn-secondary dropdown-toggle">seat</button>


                      </td>
                    </tr>


                  </tbody>

                </table>
                <div class="hk-settings-panel" :class="{ active: isPanelOpen ?? isPanelOpenSeat }">

                  <div class="nicescroll-bar position-relative">
                    <div class="settings-panel-wrap">
                      <div class="settings-panel-head">
                        <a @click="closeEditPanel" class="settings-panel-close">
                          <span><i data-feather="x"></i>x</span>
                        </a>
                      </div>

                      <p class="font-14">{{ panelModel === "seat" ? "Seats Bangku" : "Detail Movie" }}</p>
                      <div class="fm" v-if="panelModel === 'detail'">
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
                      <div class="seats" v-else>
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
  right: -450px;
  width: 450px;
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
