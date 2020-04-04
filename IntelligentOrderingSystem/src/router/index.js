import Vue from 'vue';
import Router from 'vue-router';
import IorderConfig from "../components/views/IorderConfig";
import IorderBehindConfig from "../components/views/IorderBehindConfig";
import Login from "../components/Login";
import FoodList from "../components/frontViews/FoodList";
import DrinkList from "../components/frontViews/DrinkList";
import Home from "../components/behindViews/Home";
import CarouselList from "../components/behindViews/CarouselList";
import CarouseShow from "../components/behindViews/CarouseShow";
import EmployeeList from "../components/behindViews/EmployeeList";
import RootList from "../components/behindViews/RootList";

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}


export default new Router(
  {
  routes: [
    {
      path: '*',
      redirect:'/FoodList'
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/IorderConfig',
      name: 'IorderConfig',
      redirect:'/FoodList',
      component: IorderConfig,
      children:[
        {
          path: '/FoodList',
          name: 'FoodList',
          component: FoodList
        },
        {
          path: '/DrinkList',
          name: 'DrinkList',
          component: DrinkList
        },
      ]
    },
    {
      path: '/IorderBehindConfig',
      name: 'IorderBehindConfig',
      redirect:'/Home',
      component: IorderBehindConfig,
      children:[
        {
          path: '/Home',
          name: 'Home',
          component: Home
        },
        {
          path: '/CarouselList',
          name: 'CarouselList',
          component: CarouselList
        },
        {
          path: '/CarouseShow',
          name: 'CarouseShow',
          component: CarouseShow
        },
        {
          path: '/EmployeeList',
          name: 'EmployeeList',
          component: EmployeeList
        },
        {
          path: '/RootList',
          name: 'RootList',
          component: RootList
        }
      ]
    }
  ]
})
