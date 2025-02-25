import {
  ref,

  onMounted
} from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);


// vari
export function useScanner() {
  const users = ref([]);
  const baseurl = "http://localhost:4000/";
  // const indexing = ref(0);
  const isPanel = ref(false)
  const result = ref([]);
  const infow = ref([])
  // const data = ref([]);

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
  //
  const openEditPanel = () => {
    isPanel.value = true;

  }
  const closePanel = () => {
    isPanel.value = false;

  }
  const onDecode = async (text) => {
    result.value = text;
    // alert(result.value[0].rawValue);
    // console.log("value", result.value)
    const respon = await fetch(baseurl + 'movies/postScan', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: result.value[0].rawValue
      })

    })
    const datar = await respon.json();
    infow.value = datar.data
    // alert(message.value)
    // console.log(respon.body)
    // if(respon.ok === tr){

    // }
  }
  const onError = (err) => {
    console.error(err);
  };


  return {
    users,
    baseurl,
    getUsers,
    isPanel,
    closePanel,
    openEditPanel,

    // scan
    onDecode,
    onError,
    result,
    infow


  }

}
