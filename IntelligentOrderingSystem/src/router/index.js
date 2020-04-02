import Vue from 'vue';
import Router from 'vue-router';
import Login from "../components/Login";
import FoodList from "../components/frontViews/FoodList";
import IorderConfig from "../components/views/IorderConfig";
import IorderBehindConfig from "../components/views/IorderBehindConfig";
import Home from "../components/behindViews/Home";
import CarouselList from "../components/behindViews/CarouselList";
import CarouseShow from "../components/behindViews/CarouseShow";

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
        {
          path: '/CarouselList',
          name: 'CarouselList',
          component: CarouselList
        },
        {
          path: '/CarouseShow',
          name: 'CarouseShow',
          component: CarouseShow
        }
      ]
    }
  ]
})
