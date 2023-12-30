import { createRouter, createWebHistory } from "vue-router";
const Login = () => import("../views/Login.vue");
const Home  = () => import("../views/Home.vue");
const Manager = () => import("../views/Manager.vue");
const IFrame = () => import("../views/IFrame.vue");
import { useAuthUserStore } from '../store/index'


const routes = [
    {
        path: "/",
        name: "Login",
        component: Login,
    },

    {
        path: "/Home",
        name: "Home",
        component: Home,
        meta:{requiresAuth: true}
    },
    {
      path: "/Manager",
      name: "Manager",
      component: Manager,
      meta:{requiresAuth: true}
    },
    {
      name: 'IFrame',
      path: '/reports/',
      component: IFrame,
      props: true
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: Login,
      meta: {
        requiresAuth: false
      }
    }
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if(to.meta.requiresAuth) {
      const authUser = useAuthUserStore()
      if(!authUser.user) {
        //console.log(authUser)
        next({name:'Login'})
      }
      else{
          next()
      }
    }else {
    next()
    }
  })  


export default router;