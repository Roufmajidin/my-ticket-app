<script>
import { computed } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { useUsers } from "@/stores/users_controller";
import { useScanner } from "@/stores/scanner_controller";
import { useRoute } from "vue-router";
// import { QrcodeStream } from "vue-barcode-reader";
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  name: "usersVi",
  components: {
    QrcodeStream,
  },

  setup() {
    // const QrcodeStream = defineAsyncComponent(() => import("vue-qrcode-stream"));

    //
    const route = useRoute()
    const isScan = computed(() => route.query.isScan === "true");

    console.log("ini", { isScan: isScan.value });
    const { users, formatDate } = useUsers();
    const { isPanel, openEditPanel, closePanel, onDecode, onError, result, infow } = useScanner();

    return {
      users,
      isScan,
      formatDate,
      openEditPanel,
      closePanel,
      isPanel,
      onDecode, onError, result,
      QrcodeStream, infow

    };

  }
};
</script>

<template>

  <div class="hk-pg-wrapper">

    <!-- Breadcrumb -->
    <div class="row">
      <div class="col-xl-12">
        <section class="hk-sec-wrapper">
          <h5 class="hk-sec-title">All Users</h5>
          <button v-if="isScan == true" id="" v-on:click="openEditPanel()" class="btn btn-primary mt-30">Scanner
          </button>
          <div class="row">
            <div class="col-sm">
              <div class="table-wrap">

                <table id="datable_1" class="table table-hover w-100 display pb-30">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>created</th>
                      <th>detail</th>
                    </tr>
                  </thead>
                  <tbody>


                    <tr v-for="(item, index) in users" :key="index">

                      <td>{{ index + 1 }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.email }}</td>
                      <td>{{ formatDate(item.created_at) }}</td>
                      <td>
                        <router-link :to="{ name: 'users_detail', params: { id: item.id } }">

                          <button type="button" class="btn btn-success mr-2">

                            <i class="zmdi zmdi-run"></i></button>
                        </router-link>
                      </td>
                    </tr>


                  </tbody>

                </table>
                <!-- side comp -->
                <div class="hk-settings-panel" :class="{ active: isPanel }">

                  <div class="nicescsroll-bar">
                    <div class="settings-panel-wrap">
                      <div class="settings-panel-head">
                        <a @click="closePanel" class="settings-panel-close">
                          <span><i data-feather="x"></i>x</span>
                        </a>
                      </div>

                      <p class="font-14">

                      </p>
                      Scanner :
                      <!-- <QrcodeStream v-if="isScan" @decode="onDecode" @init="onError" /> -->
                      <QrcodeStream v-if="isScan == true" @detect="onDecode" @init="onError" />

                      <p v-if="result">Hasil Scan: {{ result[0]?.rawValue }}</p>
                      <p>Hasil Scan: {{ infow }}</p>

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
