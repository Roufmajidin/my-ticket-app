import {
  createRouter,
  createWebHistory
} from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import MovieData from '../views/MovieData.vue'
import users from '../views/users.vue'
import users_detail from '../views/users_detail.vue'

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes: [{
      //   path: '/',
      //   name: 'home',
      //   component: HomeView,
      // },
      // {
      path: '/movie',
      name: 'home',
      component: MovieData,
    },

    {

      path: '/users',
      name: 'users',
      component: users,
      props: (route) => ({
        isScan: route.query.isScan
      }) // Ambil dari query

    },
    {
      path: '/users/detail/:id',
      name: 'users_detail',
      component: users_detail,
      props: true
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
