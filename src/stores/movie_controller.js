import {
  ref,
  computed,
  onMounted
} from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function useMovie() {
  const baseurl = "http://localhost:4000";
  const movie = ref([]);
  const seats = ref([]);
  const isPanelOpen = ref(false);
  const isPanelOpenSeat = ref(false);
  const panelModel = ref("");

  const selectedMovie = ref({
    movie_name: "",
    genre: "",
    studio: "",
    dimulai: "",
    durasi: "",
  });

  const openEditPanel = (movie) => {
    selectedMovie.value = {
      movie_name: movie.movies.judul,
      genre: movie.movies.genre,
      studio: movie.rooms.name,
      dimulai: new Date(movie.time).toISOString().slice(0, 16),
      durasi: movie.movies.durasi,
    };
    isPanelOpen.value = true;
    panelModel.value = 'detail';

    console.log(selectedMovie.value);
  };

  const closeEditPanel = () => {
    isPanelOpen.value = false;
  };

  const saveChanges = () => {
    console.log("Updated Movie:", selectedMovie.value);
    closeEditPanel();
  };

  const showSeat = async (seat, idWaktu) => {
    isPanelOpen.value = true;
    panelModel.value = 'seat';

    const response = await fetch(`${baseurl}/movies/seats/${seat}/${idWaktu}`);
    const data = await response.json();

    seats.value = data.data.seat || [];
    console.log(seat + "," + idWaktu);
    console.log(seats);
  };

  const groupedSeats = computed(() => {
    return seats.value.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {});
  });

  const formatWIB = (time) => {
    return dayjs.utc(time).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss");
  };

  const fetchMovie = async () => {
    try {
      const response = await fetch(baseurl + "/movies/movies");
      const data = await response.json();
      movie.value = data;
      console.log(movie);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  onMounted(() => {
    fetchMovie();
  });

  return {
    movie,
    formatWIB,
    showSeat,
    seats,
    groupedSeats,
    openEditPanel,
    closeEditPanel,
    isPanelOpen,
    selectedMovie,
    saveChanges,
    isPanelOpenSeat,
    panelModel
  };
}
