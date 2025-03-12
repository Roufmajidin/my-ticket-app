<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { useStatistic } from "@/stores/statistic_controller";
import { nextTick, ref, watch } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

//
export default {
  components: { Bar },

  setup() {
    const statistic = useStatistic();
    const movieSelect = ref(null);

    const selectedMovie = ref("");
    const totalSeats = 60;
    const chartData = ref({
      labels: [],
      datasets: [
        {
          label: "Kursi Tersisa",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    });
    const focusSelect = async () => {
      await nextTick();
      if (movieSelect.value) {
        movieSelect.value.focus();
        // movieSelect.value.click();
        const event = new KeyboardEvent("keydown", { key: "ArrowDown" })
        movieSelect.value.dispatchEvent(event)
      }
    };
    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: totalSeats,
        },
      },
    };
    // data
    let seats = ref([]);
    const getStatistic = async (id) => {
      if (!id) {
        alert("Silakan pilih movie terlebih dahulu");
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/movies/statistics/${id}`);
        const data = await response.json();

        if (!data.seat_booked || data.seat_booked.length === 0) {
          alert("Data booking tidak tersedia untuk film ini.");
          return;
        }

        const labels = data.seat_booked.map((item) => item.tanggal);
        const availableSeats = data.seat_booked.map((item) => totalSeats - item.jumlah_booking);
        seats.value = availableSeats.map((l, i) =>
        ({
          no: i + 1,
          date: labels[i],
          seat: availableSeats[i]
        }))




        console.log(seats.value)
        chartData.value = {
          labels: labels,
          datasets: [
            {
              label: "Kursi Tersisa",
              data: availableSeats,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        };

        console.log("Chart Data:", chartData.value);
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
        alert("Terjadi kesalahan dalam mengambil data statistik.");
      }
    };

    watch(selectedMovie, (newValue) => {
      if (newValue) {
        getStatistic(newValue);
      }
    });
    const generatePDF = async () => {
      const pdfContent = document.getElementById("pdf-content");
      const scale = 2;

      const canvas = await html2canvas(pdfContent, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("laporan_penjualan.pdf");
    }

    return {
      ...statistic,
      selectedMovie,
      chartData,
      chartOptions,
      focusSelect,
      movieSelect,
      seats,
      generatePDF
    };
  }
}



//
</script>

<template>

  <div class="hk-pg-wrapper">

    <!-- Breadcrumb -->
    <div class="col-xl-12">
      <section class="hk-sec-wrapper">
        <div class="hk-pg-header mb-10">
          <div>
            <h2 class="hk-pg-title font-weight-600 mb-10">Analytics Dashboard</h2>
            <p>Rekapitulasi penjualan tiket bioskop
              <a href="#" @click.prevent="focusSelect">silahkan select movie terkait</a>
            </p>
          </div>
          <div class="hk-pg-header align-items-top text-start">
            <div class="d-flex ">
              <select style="  text-align: left; text-align-last: left;direction: ltr;" ref="movieSelect"
                class="btn btn-sm btn-outline-dark btn-wth-icon icon-wthot-bg mr-15 mb-15 ml-15" v-model="selectedMovie"
                @change="getStatistic(selectedMovie)">
                <option disabled value="">Pilih Movie</option>

                <option v-for="moviess in movies" :key="moviess.id" :value="moviess.movies.id">
                  {{ moviess.movies.judul }}
                </option>
              </select>



              <button class="btn btn-sm btn-outline-secondary btn-wth-icon icon-wthot-bg mr-15 mb-15"><span
                  class="icon-label"><i class="fa fa-print"></i> </span><span class="btn-text">Print </span></button>
              <button @click="generatePDF" class="btn btn-sm btn-outline-dark btn-wth-icon icon-wthot-bg mb-15"><span
                  class="icon-label"><i class="fa fa-download"></i> </span><span class="btn-text">Export
                </span></button>

            </div>
          </div>
          <!-- start pdf -->
        </div>
        <div class="" id="pdf-content">

          <div class="row">
          </div>
          <div class="col-xl-12">
            <div class="hk-row">
              <div class="col-lg-7">
                <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />

              </div>

              <div class="col-lg-5" v-if="selectedMovie !== ''">
                <div class=" hk-row">
                  <div class="col-sm-6">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="d-flex justify-content-between mb-5">
                          <div>
                            <span class="d-block font-15 text-dark font-weight-500">Movie</span>
                          </div>
                          <div>
                            <span class="badge badge-primary  badge-sm">+10%</span>
                          </div>
                        </div>
                        <div>
                          <span class="d-block display-5 text-dark mb-5">{{ dataS.movie }}</span>
                          <small class="d-block">{{ formatRupiah(dataS.datas_movie.harga) }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="d-flex justify-content-between mb-5">
                          <div>
                            <span class="d-block font-15 text-dark font-weight-500">Tiket terjual</span>
                          </div>
                          <div>
                            <span class="badge badge-danger   badge-sm">+10%</span>
                          </div>
                        </div>
                        <div>
                          <span class="d-block display-5 text-dark mb-5">{{ dataS.jumlah_b }}/60 <a
                              style="font-size: 20px;">sheet</a></span>
                          <small class="d-block">{{ dataS.jumlah_b }} terjual/60</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="d-flex justify-content-between mb-5">
                          <div>
                            <span class="d-block font-15 text-dark font-weight-500">Saldo</span>
                          </div>
                          <div>
                            <span class="badge badge-primary  badge-sm">-1.5%</span>
                          </div>
                        </div>
                        <div>
                          <span class="d-block display-5 text-dark mb-5">{{ formatRupiah(dataS.datas_movie.harga *
                            dataS.jumlah_b)
                          }}</span>
                          <small class="d-block">Tiket x {{ dataS.jumlah_b }} booking</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="card card-sm">
                      <div class="card-body">
                        <div class="d-flex justify-content-between mb-5">
                          <div>
                            <span class="d-block font-15 text-dark font-weight-500">Earnings</span>
                          </div>
                          <div>
                            <span class="badge badge-warning  badge-sm">+60%</span>
                          </div>
                        </div>
                        <div>
                          <span class="d-block display-5 text-dark mb-5">$89M</span>
                          <small class="d-block">$100M Targeted</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>



              </div>

            </div>
          </div>
          <!-- pdf -->
          <table id="datable_1" class="table table-hover w-100 display pb-30">
            <thead>
              <tr>
                <th>tanggal</th>
                <th>terbooking</th>
                <th>Sisa Kursi</th>
                <th>Dipesan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in dataS.seat_booked" :key="item">
                <td>{{ item.tanggal }}</td>
                <td>{{ item.jumlah_booking }} kursi</td>
                <td>{{ 60 - item.jumlah_booking }}</td>
                <td>
                  <ul style="text-align: start;" v-for="i in item.bookings" :key="i">
                    <!-- <li href="">id {{ i.booking_id }}</li> -->
                    <li class="btn btn-secondary" href="">{{ i.seat.seat.number }} {{ i.seat.seat.row }} </li>
                    {{
                      i.order.orders.status == 0 ? "Pending" : "Paid" }}
                    {{ i.order.user.email }}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>



















































</template>


<style scoped>
/* pdf */
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

li {
  margin: 4px 0;
}

.report {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
}

.report-table th,
.report-table td {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
}

button {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}



.table th {
  background-color: #708CA8FF;
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
