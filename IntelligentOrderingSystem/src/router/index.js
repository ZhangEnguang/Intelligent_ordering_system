import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import NavBar from "../components/frontViews/NavBar";
import Header from "../components/frontViews/Header";
import FoodList from "../components/frontViews/FoodList";
import IorderConfig from "../components/views/IorderConfig";
import UserMsg from "../components/frontViews/UserMsg";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect:'IorderConfig'
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/NavBar',
      name: 'NavBar',
      component: NavBar
    },
    {
      path: '/Header',
      name: 'Header',
      component: Header
    },
    {
      path: '/UserMsg',
      name: 'UserMsg',
      component: UserMsg
    },
    {
      path: '/IorderConfig',
      name: 'IorderConfig',
      component: IorderConfig,
      children:[
        {
          path: '/FoodList',
          name: 'FoodList',
          component: FoodList
        },
      ]
    },
  ]
})
