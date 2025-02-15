<script>
// import { ref, onMounted, computed } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { useMovie } from "@/stores/movie_controller";
export default {
  setup() {
    return useMovie();

  }
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
                      <!-- <th>Studio</th> -->
                      <th>Duration</th>
                      <th>Dimulai</th>
                      <th>action</th>
                    </tr>
                  </thead>
                  <tbody>


                    <tr v-for="(item, index) in movie" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td data-toggle="tooltip-info" data-placement="right" title="Tooltip on right">{{
                        item.movies?.judul }}</td>
                      <td>{{ item.movies?.genre }}</td>
                      <!-- <td> -->
                      <!-- {{ new Date(item.time).toISOString().slice(0, 16) }} -->
                      <!-- <ul>
                          <li v-for="w in item.waktu" :key="w.id">
                            <h6>{{ formatWIB(w.waktu) }}

                            </h6>
                            <h5> {{ w.studio }} <span style="color: green; font-size: 16px;">({{ w.status == 1 ?
                              "Selesai" :
                              "Berlangsung" }})</span></h5>
                          </li>


                        </ul> -->
                      <!-- </td> -->
                      <td>{{ item.movies.durasi }} min</td>

                      <td>
                        <button type="button" class="btn btn-info mr-2" @click="openEditPanel(item, 'tanggal')"> <i
                            class=" zmdi
                          zmdi-calendar font-18"></i>
                        </button>
                        <button type="button" class="btn btn-success mr-2" @click="openEditPanel(item, 'edit')">

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
                        {{ panelModel === "seat" ? `Seats Bangku` : modeForm ===
                          'add' ? "Tambah Movie" : "Detail Movie"
                        }}
                      </p>
                      Movie : {{ selectedMovie.movie_name }}
                      <div class="fm" v-if="panelModel === 'detail' || modeForm === 'add'">
                        <form class="nicescroll-bar">
                          <div class="form-group">
                            <label>movie name</label>
                            <input type="text" class="form-control" v-model="selectedMovie.movie_name">
                          </div>
                          <div class="row">
                            <div class="col-sm">
                              <form>
                                <!-- if seletedMovie.gambar -->
                                <img :src="baseurl + selectedMovie.imageUrl" v-if="imageUrl != selectedMovie.imageUrl"
                                  alt="Preview" class="avatar-img" height="100px">
                                <img :src="imageUrl" v-if="imageUrl != selectedMovie.imageUrl" class="avatar-img"
                                  height="100px">
                                <div class="form-group">
                                  <div class="fileinput fileinput-new input-group" data-provides="fileinput">
                                    <div class="input-group-prepend">
                                      <span class="input-group-text">Upload</span>
                                    </div>
                                    <div class="form-control text-truncate" data-trigger="fileinput"><i
                                        class="glyphicon glyphicon-file fileinput-exists"></i> <span
                                        class="fileinput-filename"></span></div>
                                    <span class="input-group-append">
                                      <span class=" btn btn-primary btn-file"><span class="fileinput-new"
                                          v-if="!file">Select
                                          file</span><span class="fileinput-exists" v-else>Change</span>
                                        <input type="file" name="..." @change="handleFile" accept="image/*">
                                      </span>
                                      <a href="#" class="btn btn-secondary fileinput-exists" data-dismiss="fileinput"
                                        v-if="file">Remove</a>
                                    </span>
                                  </div>
                                </div>
                              </form>
                            </div>
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
                            <input type="text" class="form-control" v-model="selectedMovie.genre">
                          </div>
                          <div class="form-group">
                            <label>actor utama</label>
                            <input type="text" class="form-control" v-model="selectedMovie.actor_u">
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
                                <div class="fs d-flex align-items-center flex-wrap mr-2">
                                  <button class="btn btn-primary  mr-2">
                                    {{ studio.nameStudio }}
                                    {{ studio.waktu }}
                                  </button>
                                  <div class="fs">
                                    <input type="datetime-local" class="form-control" v-model="formattedWaktuLocal"
                                      @input="updateWaktu" />
                                  </div>
                                </div>

                                <div class="custom-control custom-checkbox">
                                  <input type="checkbox" class="custom-control-input" :id="'customCheck' + index"
                                    @change="toggleStudioSelection($event, studio.id, movie)"
                                    :checked="studio.status === 1 || selectedMovie.selectedStudios.includes(studio.id)">
                                  <label class="custom-control-label" :for="'customCheck' + index">
                                    {{ studio.status == 0 ? "SL" : "Idle" }}
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



                        </form>
                        <hr>
                        <button v-if="modeForm === 'add'" id="reset_settings"
                          class="btn btn-primary btn-block btn-reset mt-30" @click=" storeMovie()">simpan
                        </button>
                        <button v-if="panelModel === 'detail' && modeForm !== 'add'" id="reset_settings"
                          class="btn btn-primary btn-block btn-reset mt-30" @click=" saveEdit()">simpan edit
                        </button>
                      </div>

                      <div class="seats" v-if="panelModel === 'seat'">
                        <!-- calendar -->



                        <div class=" calendar">
                          <div class="calendar-header">
                            <span class="month-picker" @click="toggleMonthList">
                              {{ monthNames[currentMonth] }}
                            </span>
                            <div class="year-picker">
                              <span class="year-change" @click="prevYear">
                                <i class=" zmdi
                                zmdi-arrow-left  font-18"></i>
                              </span>
                              <span>{{ currentYear }}</span>
                              <span class="year-change" @click="nextYear"><i class=" zmdi
                                zmdi-arrow-right  font-18"></i></span>
                            </div>
                          </div>


                          <div class="calendar-body">
                            <div class="calendar-week-days">
                              <div>Sun</div>
                              <div>Mon</div>
                              <div>Tue</div>
                              <div>Wed</div>
                              <div>Thu</div>
                              <div>Fri</div>
                              <div>Sat</div>
                            </div>

                            <div class="calendar-days">
                              <!-- <div v-for="(day, index) in daysArray" :key="index"
                                :class="{ 'current-date': isToday(day) }">
                                {{ day }}
                              </div> -->
                              <div v-for="(day, index) in daysArray" :key="index" @click="selectDay(day)" :class="{
                                'current-date': isToday(day),
                                'event-day': isEventDay(day)
                              }">
                                {{ day }}
                                <span v-if="isEventDay(day)" class="event-dot"></span>
                              </div>
                            </div>
                          </div>
                          <div class="calendar-footer">
                            <div v-if="showMonthList" class="month-list">
                              <div v-for="(month, index) in monthNames" :key="index" @click="setMonth(index)">
                                {{ month }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-for="(movie, index) in movieDates" :key="index" class="alert alert-success" role="alert"
                          @click="toggleSeats(movie)" style="cursor: pointer;">

                          {{ formatDate(movie.waktu) }}
                          <br>
                          <span style="font-size: 16px;color: blue;">

                            {{ movie.name }}
                          </span>
                          {{ movie.jam }} WIB
                          <i style="font-size: 18px;" class="zmdi zmdi-airline-seat-recline-normal ml-4 mr-4"
                            v-if="expandedMovieId[movie.id]">{{
                              seats.length }} seat</i>
                          <i class=" zmdi "
                            :class="expandedMovieId[movie.id] ? 'zmdi-chevron-down' : 'zmdi-chevron-right'">

                          </i>
                          <div class=" d-flex flex-wrap" v-if="expandedMovieId === movie.id">
                            <template v-for="(seats, row) in groupedSeats" :key="row">

                              <div class="d-flex align-items-center">
                                <span class="font-weight-bold me-2" style="margin: 2px">{{ row }} </span>
                                <div class="d-flex flex-wrap">
                                  <button v-for="seat in seats" :key="seat.id" type="button"
                                    style="margin: 4px;height: 30px;width: 30px;" :class="{
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
                        <!-- <div class="d-flex align-items-center flex-wrap" v-if="selectedMovie.studio.length">
                          <div v-for="(studio, index) in selectedMovie.studio" :key="index"
                            class="d-flex align-items-center m-2">


                            <div class="fs d-flex align-items-center flex-wrap mr-2">
                              <button class="btn btn-primary  mr-2">
                                {{ studio.nameStudio }}
                              </button>
                              <div class="fs">
                                <input type="datetime-local" class="form-control" v-model="studio.waktu">
                              </div>
                            </div>

                            <div class="custom-control custom-checkbox">
                              <input type="checkbox" class="custom-control-input" :id="'customCheck' + index"
                                @change="toggleStudioSelection($event, studio.id, movie)"
                                :checked="studio.status === 1 || selectedMovie.selectedStudios.includes(studio.id)">
                              <label class="custom-control-label" :for="'customCheck' + index">
                                {{ studio.status == 0 ? "SL" : "Idle" }}
                              </label>
                            </div>

                          </div>
                        </div> -->






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
