import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login";
import NavBar from "../components/frontViews/NavBar";
import Header from "../components/frontViews/Header";
import FoodList from "../components/frontViews/FoodList";
import IorderConfig from "../components/views/IorderConfig";
import UserMsg from "../components/frontViews/UserMsg";
import HeaderBehind from "../components/behindViews/HeaderBehind";
import NavBarBehind from "../components/behindViews/NavBarBehind";
import IorderBehindConfig from "../components/views/IorderBehindConfig";
import Home from "../components/behindViews/Home";

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
      path:'/HeaderBehind',
      name:'HeaderBehind',
      component:HeaderBehind
    },
    {
      path:'/NavBarBehind',
      name:'NavBarBehind',
      component:NavBarBehind
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
    {
      path: '/IorderBehindConfig',
      name: 'IorderBehindConfig',
      component: IorderBehindConfig,
      children:[
        {
          path: '/Home',
          name: 'Home',
          component: Home
        },
      ]
    }
  ]
})
