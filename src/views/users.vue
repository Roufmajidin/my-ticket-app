<script>
// import { ref, onMounted, computed } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { useUsers } from "@/stores/users_controller";
export default {
  setup() {
    return useUsers();

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


              </div>
            </div>
          </div>
        </section>


      </div>
    </div>
  </div>


</template>

<style scoped></style>
