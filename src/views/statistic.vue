<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { useStatistic } from "@/stores/statistic_controller";
import { ref, watch } from "vue";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

//
export default {
  components: { Bar },

  setup() {
    const statistic = useStatistic();
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

    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: totalSeats,
        },
      },
    };

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

    return {
      ...statistic,
      selectedMovie,
      chartData,
      chartOptions,
    };
  },
};


//
</script>

<template>

  <div class="hk-pg-wrapper">

    <!-- Breadcrumb -->
    <div class="row">
      <div class="col-xl-12">
        <section class="hk-sec-wrapper">
          <div class="hk-pg-header mb-10">
            <div>
              <h4 class="hk-pg-title"><span class="pg-title-icon"><span class="feather-icon"><i
                      data-feather="book"></i></span></span>st</h4>
            </div>
            <div class="d-flex">
              <a href="#" class="text-secondary mr-15"><span class="feather-icon"><i
                    data-feather="printer"></i></span></a>
              <a href="#" class="text-secondary mr-15"><span class="feather-icon"><i
                    data-feather="download"></i></span></a>
              <!-- <button class="btn btn-primary btn-sm">Scanner</button> -->
              <select class="form-control" v-model="selectedMovie" @change="getStatistic(selectedMovie)">
                <option disabled value="">Pilih Movie</option>

                <option v-for="moviess in movies" :key="moviess.id" :value="moviess.movies.id">
                  {{ moviess.movies.judul }}
                </option>
              </select>
            </div>
          </div>
          <section class="hk-sec-wrapper">
            <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
          </section>
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
