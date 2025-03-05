<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  // name: "usersVi",
  components: { Bar },

  data() {
    return {
      chartData: {
        labels: ['January', 'February', 'March', 'april', 'may', 'jun', 'jul'],
        datasets: [{ data: [20, 20, 12, 13, 12, 12, 12] }]
      },
      chartOptions: {
        responsive: true,
        // maintainAspectRatio: false,
        scales: {
          x: {
            barPercentage: 0.5,
            categoryPercentage: 0.8,
          },
          y: {
            beginAtZero: true,
          },
        }
      }
    }
  },
  setup() {
  }
};
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
              <button class="btn btn-primary btn-sm">Scanner</button>
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
