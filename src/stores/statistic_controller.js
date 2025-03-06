import {
  ref,
  onMounted
} from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function useStatistic() {
  const baseurl = "http://localhost:4000/";

  const movies = ref([])
  const dataS = ref([])
  const selectedMovie = ref("")
  const cartData = ref({
    labels: [],
    datasets: []
  });



  onMounted(() => {
    fetchMovie()

  })

  // get STatistic
  const getStatistic = async (id) => {
    const data = await fetch(baseurl + "movies/statistics/" + id)
    const response = await data.json();
    dataS.value = response;
    const labels = dataS.value.seat_booked.map(item => item.tanggal)
    const dataSet = dataS.value.seat_booked.map(item => item.jumlah_booking)
    // alert(labels)
    if (!response.seat_booked || response.seat_booked.length === 0) {
      alert("Data seat_booked tidak ditemukan");
      return;
    }

    // Ambil tanggal dan jumlah booking
    // const labels = response.seat_booked.map(item => item.tanggal);
    // const dataSet = response.seat_booked.map(item => item.jumlah_booking);

    cartData.value = {
      labels: labels,
      datasets: [{
        label: "Jumlah Booking",
        data: dataSet,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };

    console.log("Labels:", cartData.value.labels);
    alert(cartData.value.labels);

  }
  const fetchMovie = async () => {
    try {
      // if (page < 1 || page > totalPage.value) return;

      // loading.value = true;

      const response = await fetch(baseurl + "movies/movies?page=1" + "&limit=10");
      const data = await response.json();
      console.log("Fetched Data:", data);

      movies.value = data.movies;

      // currentPage.value = data.current_page
      // totalPage.value = data.total_pages
      // movieDates.value = data;
      // loading.value = false;
      console.log('hallo', movies.value)

    } catch (error) {
      // console.error("Error fetching movies:", error);
    }
  };


  return {
    dataS,
    getStatistic,
    fetchMovie,
    movies,
    selectedMovie,
    cartData,


  }
}
