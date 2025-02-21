import {
  ref,
  computed,
  watch,
  onMounted
} from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);


// vari
export function useUsers() {
  const users = ref([]);
  const baseurl = "http://localhost:4000/";


  //
  onMounted(() => {
    getUsers();

  })
  const getUsers = async () => {
    try {
      const res = await fetch(baseurl + "movies/users");
      const data = await res.json();
      users.value = data.data;
      // console.log(users)

    } catch (error) {
      console.error("Error fetching users:", error);


    }
  }
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const day = date.getDate();
    const month = bulan[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };



  return {
    users,
    baseurl,
    getUsers,
    formatDate

  }
}
