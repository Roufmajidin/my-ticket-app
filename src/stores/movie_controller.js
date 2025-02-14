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
  const modeForm = ref('');
  const canSeat = ref([]);
  const allSeatInData = ref([])
  const selectedDate = ref(null);
  const selectedStudios = ref([]);
  const movieDates = ref([]);

  const expandedMovieId = ref(null);

  const selectedMovie = ref({
    movie_name: "",
    idm: "",
    genre: "",
    studio: [],
    dimulai: [],
    durasi: "",
    tahun: "",
    gambar: "",
    sinopsis: "",
    actor_u: "",
    status: 0,
    selectedStudios: []

  });
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const saveEdit = async () => {
    try {
      const resp = await fetch(baseurl + '/movies/saveEdit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedMovie.value)
      })
      await resp.json();
      if (resp.ok) {
        closeEditPanel();
        fetchMovie();
      }
    } catch (error) {
      console.error("Gagal menonaktifkan studio:", error);


    }
    console.log(selectedMovie.value)
  }

  const openEditPanel = (movie, tipe) => {
    expandedMovieId.value = {};
    movieDates.value = []

    selectedMovie.value = {
      movie_name: movie.movies ? movie.movies.judul : "N/A",
      idm: movie.movies.id,
      genre: movie.movies ? movie.movies.genre : "N/A",
      studio: movie.waktu.map(w => ({
        id: w.id,
        room_id: w.room_id,
        waktu: w.waktu,
        movie_id: w.movie_id,
        nameStudio: w.studio,
        selectedStudios: [],
        status: w.status

      })),
      dimulai: movie.waktu.map(a => ({
        id: a.id,
        room_id: a.room_id,
        waktu: a.waktu,
        movie_id: a.movie_id,
        nameStudio: a.studio,
        status: a.status,
        selectedStudios: [],


      })),
      durasi: movie.movies ? movie.movies.durasi : "N/A",
      actor_u: movie.movies ? movie.movies.actor_u : "N/A",
      gambar: movie.movies ? movie.movies.gambar : "",
      tahun: movie.movies ? movie.movies.tahun : "N/A",
      sinopsis: movie.movies ? movie.movies.sinopsis : "N/A",
      selectedStudios: movie.waktu.filter(w => w.status === 1).map(w => w.id),

    };
    // console.log(selectedMovie.value);

    isPanelOpen.value = true;
    if (tipe === 'tanggal') {
      showPanel();
      // panelModel.value = 'seat'
    } else {

      panelModel.value = 'detail';
    }

  };

  const closeEditPanel = () => {
    isPanelOpen.value = false;
  };

  const saveChanges = () => {
    console.log("Updated Movie:", selectedMovie.value);
    closeEditPanel();
  };
  const showPanel = (seats) => {
    isPanelOpen.value = true;
    panelModel.value = 'seat';
    allSeatInData.value = seats;

    // for (const key in seats) {
    //   console.log(seats[key].movie_id)
    // console.log(allSeatInData.value)
    const studios = selectedMovie.value.studio.map(movie => {
      return {
        id: movie.id,
        name: movie.nameStudio,
        movie_id: movie.movie_id,
        waktu: movie.waktu,
        jam: movie.waktu,
        room_id: movie.room_id,
        m: movie,
        movie_name: selectedMovie.value.movie_name

      };
    });
    movieDates.value = studios;
    console.log("Updated movieDates:", movieDates.value);


  }
  const toggleStudioSelection = async (event, studioId) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      if (!selectedMovie.value.selectedStudios.includes(studioId)) {
        selectedMovie.value.selectedStudios.push(studioId);
      }
    } else {
      const index = selectedMovie.value.selectedStudios.indexOf(studioId);
      if (index !== -1) {
        selectedMovie.value.selectedStudios.splice(index, 1);
      }
    }

    // Kirim data ke backend
    // await updateStudioStatus(studiosToSend);
  };

  const setSelectedDate = (date, roomId, waktuId, movieId) => {
    selectedDate.value = date;
    showSeat(roomId, waktuId, movieId);
  };
  const showSeat = async (seat, idWaktu, movieId) => {
    // isPanelOpen.value = true;
    // panelModel.value = 'seat';

    const response = await fetch(`${baseurl}/movies/seats/${seat}/${idWaktu}`);
    const data = await response.json();

    seats.value = data.data.seat || [];
    console.log(seat + "," + idWaktu);
    // console.log(seats.value.length);
    // toggleSeats(movieId)
  };

  const groupedSeats = computed(() => {
    return seats.value.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {});
  });

  const formatWIB = (time) => {
    return dayjs(time).format("DD/MM/YYYY HH:mm");
  };

  const fetchMovie = async () => {
    try {
      const response = await fetch(baseurl + "/movies/movies");
      const data = await response.json();
      console.log("Fetched Data:", data);

      movie.value = data;
      console.log(movie.value)
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
  const addMovie = async () => {
    isPanelOpen.value = true;
    modeForm.value = 'add';
    const response = await fetch(baseurl + "/movies/getRoom");
    const data = await response.json();
    canSeat.value = data;
    console.log(canSeat);
  }
  const monthNames = ref([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]);


  const currentDate = new Date();
  const currentMonth = ref(currentDate.getMonth());
  const currentYear = ref(currentDate.getFullYear());
  const showMonthList = ref(false);

  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const getFebDays = (year) => (isLeapYear(year) ? 29 : 28);

  const daysInMonth = computed(() => {
    return [
      31, getFebDays(currentYear.value), 31, 30, 31, 30,
      31, 31, 30, 31, 30, 31
    ][currentMonth.value];
  });

  const firstDayOfMonth = computed(() => new Date(currentYear.value, currentMonth.value).getDay());

  const daysArray = computed(() => {
    let days = [];
    for (let i = 0; i < firstDayOfMonth.value; i++) {
      days.push("");
    }
    for (let i = 1; i <= daysInMonth.value; i++) {
      days.push(i);
    }
    return days;
  });

  const isToday = (day) => {
    if (!day) return false;
    return (
      day === currentDate.getDate() &&
      currentMonth.value === currentDate.getMonth() &&
      currentYear.value === currentDate.getFullYear()
    );
  };

  const prevYear = () => {
    currentYear.value--;
  };

  const nextYear = () => {
    currentYear.value++;
  };

  const toggleMonthList = () => {
    showMonthList.value = !showMonthList.value;
  };

  const setMonth = (index) => {
    currentMonth.value = index;
    showMonthList.value = false;
  };
  onMounted(() => {
    fetchMovie();
  });
  const filteredEvents = computed(() => {
    if (!selectedDate.value) return [];
    return movieDates.value.filter(event => event.day === selectedDate.value);
  });

  const selectDay = (day) => {
    const selectedDate =
      `${currentYear.value}-${String(currentMonth.value+1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    console.log("Selected Date:", selectedDate);



    const filteredStudios = selectedMovie.value.studio.filter(item => {
      const eventDate = item.waktu.split(" ")[0];
      return eventDate === selectedDate;
    });

    const studios = filteredStudios.map(movie => {
      return {
        id: movie.id,
        name: movie.nameStudio,
        movie_id: movie.movie_id,
        waktu: movie.waktu,
        jam: movie.waktu,
        room_id: movie.room_id,
        m: movie,
        movie_name: selectedMovie.value.movie_name

      };
    });
    movieDates.value = studios;

    console.log("Filtered Studios:", studios);
  };
  const hasEvent = computed(() => {

    return movieDates.value.map(event => event.waktu.split(" ")[0]);
  });

  const isEventDay = (day) => {
    const formattedDate =
      `${currentYear.value}-${String(currentMonth.value+1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return hasEvent.value.includes(formattedDate);
  };
  const toggleSeats = (movie) => {
    if (expandedMovieId.value === movie.id) {
      expandedMovieId.value = null;
      selectedMovie.value.selectedStudios.value = [];
    } else {
      expandedMovieId.value = movie.id;
      setSelectedDate(movie.waktu, movie.room_id, movie.id);
    }
  }

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
    panelModel,
    addMovie,
    modeForm,
    canSeat,
    showPanel,
    allSeatInData,
    setSelectedDate,
    selectedDate,
    selectedStudios,

    saveEdit,
    toggleStudioSelection,


    filteredEvents,
    hasEvent,
    isEventDay,
    selectDay,
    event,
    monthNames,
    currentMonth,
    currentYear,
    showMonthList,
    daysArray,
    prevYear,
    nextYear,
    toggleMonthList,
    setMonth,
    isToday,
    movieDates,
    formatDate,
    formatTime,
    expandedMovieId,
    toggleSeats
  };
}
