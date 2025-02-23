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
  const file = ref(null);
  const imageUrl = ref(null);
  const expandedMovieId = ref(null);
  const isaddevent = ref(false);
  const isdatevalue = ref(new Date());
  const room = ref([]);
  const info = ref([]);
  const selectedRoom = ref(0);
  const indexing = ref(0);
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
  const defaultMovie = {
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
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      // timeZone: "Asia/Jakarta",

      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const saveEdit = async () => {
    try {
      const fd = new FormData();
      fd.append("id", selectedMovie.value.idm || "");
      fd.append("judul", selectedMovie.value.movie_name || "");
      fd.append("genre", selectedMovie.value.genre || "");
      fd.append("tahun", selectedMovie.value.tahun || "");
      fd.append("showTime", "-");
      fd.append("sinopsis", selectedMovie.value.sinopsis || "");
      fd.append("durasi", selectedMovie.value.durasi || "");
      fd.append("actor_u", selectedMovie.value.actor_u || "");
      if (file.value) {
        fd.append("gambar", file.value);
      } else if (selectedMovie.value.gambar) {
        fd.append("gambarLama", selectedMovie.value.gambar);
      }
      const resp = await fetch(baseurl + '/movies/saveEdit', {
        method: 'PUT',
        headers: {
          // 'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // body: JSON.stringify(selectedMovie.value)
        body: fd
      })
      await resp.json();
      if (resp.ok) {
        closeEditPanel();
        fetchMovie();
        file.value = null;
        imageUrl.value = null;
      }
    } catch (error) {
      console.error("Gagal menonaktifkan studio:", error);


    }
    console.log(selectedMovie.value)
  }

  const openEditPanel = (movie, tipe, index) => {
    expandedMovieId.value = {};
    indexing.value = index;
    console.log('index tapping', indexing.value)
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
      imageUrl: movie.movies.gambar,
      tahun: movie.movies ? movie.movies.tahun : "N/A",
      sinopsis: movie.movies ? movie.movies.sinopsis : "N/A",
      selectedStudios: movie.waktu.filter(w => w.status === 1).map(w => w.id),

    };
    // imageUrl.value = movie.movies.gambar,
    file.value = movie.movies.gambar

    console.log('hallo', file.value);
    // console.log("Image URL:", selectedMovie.value.imageUrl);


    isPanelOpen.value = true;
    if (tipe === 'tanggal') {
      panelModel.value = 'seat'
      modeForm.value = ""

      showPanel();
      // panelModel.value = 'seat'
    }

    if (tipe === 'edit') {
      // panelModel.value = 'seat'
      modeForm.value = "edit"
      panelModel.value = 'detail';
    }


  };

  const closeEditPanel = () => {
    isPanelOpen.value = false;
    isaddevent.value = false;
    info.value = [];
    indexing.value = 0;
    isdatevalue.value = [];
    selectedMovie.value = {
      ...defaultMovie
    };

  };

  const saveChanges = () => {
    console.log("Updated Movie:", selectedMovie.value);
    closeEditPanel();
  };
  const showPanel = (seats) => {
    console.log('showp')
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
    console.log('showp', movieDates.value)

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

    // Kirim data => backend
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
      // movieDates.value = data;
      console.log(movie.value)
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
  const addMovie = async () => {
    isPanelOpen.value = true;
    selectedMovie.value = {
      ...defaultMovie
    };

    // selectedMovie.value.reduce;

    modeForm.value = 'add';
    const response = await fetch(baseurl + "/movies/getRoom");
    const data = await response.json();
    canSeat.value = data;
    console.log(canSeat);
  }
  // addd gbr
  const handleFile = (event) => {
    console.log("📂 File dipilih!");

    const selectedFile = event.target.files[0];

    if (selectedFile) {
      file.value = selectedFile;
      imageUrl.value = URL.createObjectURL(selectedFile);

      console.log("✅ Image URL berhasil dibuat:", imageUrl.value);
    } else {
      console.log("⚠️ Tidak ada file yang dipilih");
    }
  };

  watch(imageUrl, (newVal) => {
    console.log("🔄 imageUrl updated:", newVal);
  });
  const storeMovie = async (movie) => {
    // console.log(selectedMovie.value)
    const fd = new FormData();
    fd.append("judul", selectedMovie.value.movie_name || "");
    fd.append("genre", selectedMovie.value.genre || "");
    fd.append("tahun", selectedMovie.value.tahun || "");
    fd.append("showTime", "-");
    fd.append("sinopsis", selectedMovie.value.sinopsis || "");
    fd.append("durasi", selectedMovie.value.durasi || "");
    fd.append("actor_u", selectedMovie.value.actor_u || "");
    fd.append("gambar", file.value);

    try {
      const d = {
        'judul': selectedMovie.value.movie_name,
        'genre': selectedMovie.value.genre,
        'tahun': parseInt(selectedMovie.value.tahun),
        'showTime': '-',
        'sinopsis': selectedMovie.value.sinopsis,
        'duruasi': parseInt(selectedMovie.value.duruasi),
        'actor_u': selectedMovie.value.actor_u,
        'gambar': file.value,

      }
      const res = await fetch(baseurl + '/movies/movieadd', {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: fd
      })
      const data = await res.json();
      console.log(data)
      alert("added mov")
      if (res.ok) {
        closeEditPanel();
        fetchMovie();

      }

    } catch (error) {
      console.log(error)

    }
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
    watch(movieDates, () => {
      console.log("movieDates updated, recalculating events...");
      currentMonth.value = (currentMonth.value + 1) % 12; // Paksa perubahan
      currentMonth.value = (currentMonth.value - 1 + 12) % 12; // Kembalikan ke bulan awal
    });
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
      const eventDate = new Date(item.waktu).toISOString().split("T")[0];
      return eventDate === selectedDate;
    });
    console.log("Selected Date:", selectedMovie.value.studio);

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

    // return movieDates.value.map(event => event.waktu.split(" ")[0]);
    return movieDates.value.map(event =>
      new Date(event.waktu).toISOString().split("T")[0]
    );
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
  // format waktu input form
  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Januari = 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const parseDateTime = (formattedString) => {
    if (!formattedString) return "";

    const [time, date] = formattedString.split(" ");
    const [day, month, year] = date.split("/");
    const [hours, minutes] = time.split(":");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const apani = (dateString) => {
    if (!dateString) return "Invalid Date";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    // Format tanggal: DD/MM/YYYY
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}.${minutes}`;
  };
  const addevent = (pr) => {

    isaddevent.value = true;

  }
  // TODOD date input
  const isdatechanged = async () => {
    console.log(isdatevalue.value);
    room.value = [];
    info.value = [];
    await getRoom();
    console.log("room :", room.value)

    // isdatevalue.value = isdatevalue.value
  }
  const saveevent = async (pr) => {
    // console.log('movie,', selectedMovie.value)
    // TODO:: save event penayayangan
    // const data = {

    //   time: isdatevalue.value,
    //   roomId: selectedRoom.value,
    //   movieId: selectedMovie.value.idm,
    //   movieName: selectedMovie.value.movie_name
    // }

    // console.log(data);
    const resp = await fetch(baseurl + "/movies/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        time: isdatevalue.value,
        roomId: selectedRoom.value,
        movieId: selectedMovie.value.idm,
        movieName: selectedMovie.value.movie_name

      })

    });
    await resp.json();


    // console.log("hehe", indexing.value)
    if (!resp.ok) {
      // throw new Error(`HTTP error! Status: ${resp.status}`);
      // info.value = data;
    }
    if (resp.status === 200) {
      await fetchMovie();
      openEditPanel(movie.value[indexing.value], 'tanggal', indexing.value)

    }
    console.log("Response dari server:", info.value);

  }
  // TODOD get studio utk di selecting

  const getRoom = async () => {
    const response = await fetch(baseurl + "/movies/getRoom");
    const data = await response.json();
    room.value = data;
    // if (info.value.status === 'success') {
    //   filteringdata();

    // }
    // canSeat.value = data;
    // console.log(canSeat);
  }
  // TODOD filter data ke be berdasarkan waktu (biar ga conflicting
  // TODOD movie pada timestamp tertntu (waktu tayang))

  const filteringdata = async (event) => {
    // room
    // console.log('id', event)
    const waktu_terpilih = isdatevalue.value;
    console.log("waktu :", isdatevalue.value);
    selectedRoom.value = event.target.value;

    console.log("Studio terpilih:", event.target.value, 'waktu_terpilih :', waktu_terpilih);
    const resp = await fetch(baseurl + "/movies/room/" + event.target.value, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "waktu": waktu_terpilih
      })

    });
    const data = await resp.json();
    if (!resp.ok) {
      // throw new Error(`HTTP error! Status: ${resp.status}`);
      info.value = data;
    }
    if (resp.status === 200) {
      info.value = {
        message: "Berhasil menyimpan data studio",
        status: "success",
      };
    }
    console.log("Response dari server:", info.value);
    // console.log(resp.body)
  }
  // fix
  const formatedf = (timestamp) => {
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
    apani,
    formatedf,
    formatDateTime,
    parseDateTime,
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
    // formatTime,
    expandedMovieId,
    toggleSeats,
    storeMovie,
    handleFile,
    imageUrl,
    file,
    baseurl,
    addevent,
    isaddevent,
    isdatevalue,
    saveevent,
    isdatechanged,
    getRoom,
    room,
    filteringdata,
    info,
    indexing

  };
}
