import Vue from 'vue';
import Router from 'vue-router';
import IorderConfig from "../components/views/IorderConfig";
import IorderBehindConfig from "../components/views/IorderBehindConfig";
import Login from "../components/Login";
import FoodList from "../components/frontViews/FoodList";
import DrinkList from "../components/frontViews/DrinkList";
import DiscountList from "../components/frontViews/DiscountList";
import GracefulList from "../components/frontViews/GracefulList";
import SweetList from "../components/frontViews/SweetList";
import AddCard from "../components/frontViews/AddCard";
import VipRecharge from "../components/frontViews/VipRecharge";
import SearchOrder from "../components/frontViews/SearchOrder";
import Home from "../components/behindViews/Home";
import CarouselList from "../components/behindViews/CarouselList";
import CarouseShow from "../components/behindViews/CarouseShow";
import EmployeeList from "../components/behindViews/EmployeeList";
import RootList from "../components/behindViews/RootList";
import FoodTypeList from "../components/behindViews/FoodTypeList";
import FoodBehindList from "../components/behindViews/FoodBehindList";
import VipLevelList from "../components/behindViews/VipLevelList";
import VipList from "../components/behindViews/VipList";
import OrderMessage from "../components/behindViews/OrderMessage";
import TableList from "../components/behindViews/TableList";

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
          path: '/DiscountList',
          name: 'DiscountList',
          component: DiscountList
        },
        {
          path: '/GracefulList',
          name: 'GracefulList',
          component: GracefulList
        },
        {
          path: '/DrinkList',
          name: 'DrinkList',
          component: DrinkList
        },
        {
          path: '/SweetList',
          name: 'SweetList',
          component: SweetList
        },
        {
          path: '/AddCard',
          name: 'AddCard',
          component: AddCard
        },
        {
          path: '/VipRecharge',
          name: 'VipRecharge',
          component: VipRecharge
        },
        {
          path: '/SearchOrder',
          name: 'SearchOrder',
          component: SearchOrder
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
        },
        {
          path: '/FoodTypeList',
          name: 'FoodTypeList',
          component: FoodTypeList
        },
        {
          path: '/FoodBehindList',
          name: 'FoodBehindList',
          component: FoodBehindList
        },
        {
          path: '/VipLevelList',
          name: 'VipLevelList',
          component: VipLevelList
        },
        {
          path: '/VipList',
          name: 'VipList',
          component: VipList
        },
        {
          path: '/OrderMessage',
          name: 'OrderMessage',
          component: OrderMessage
        },
        {
          path: '/TableList',
          name: 'TableList',
          component: TableList
        }
      ]
    }
  ]
})
