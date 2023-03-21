import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store";

const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Detail = () => import('../views/detail/Detail')
const Profile = () => import('../views/profile/Profile')
const Shopcart = () => import('../views/shopcart/Shopcart')
const Register = () => import('../views/profile/Register')
const Login = () => import('../views/profile/Login')
const Address = () => import('../views/profile/address/Address')
const AddressEdit = () => import('../views/profile/address/AddressEdit')
const CreateOrder = () => import('../views/order/createOrder')
const Order = () => import('../views/order/Order')
const OrderDetail = () => import('../views/order/OrderDetail')
const Setting = () => import('../views/profile/setting/Setting')
const ChangeName = () => import('../views/profile/setting/ChangeName')
const ChangeEmail = () => import('../views/profile/setting/ChangeEmail')
const BindPhone = () => import('../views/profile/setting/BindPhone')
const ChangePassword = () => import('../views/profile/setting/ChangePassword')
const ResetPassword = () => import('../views/profile/ResetPassword')
const About = () => import('../views/profile/setting/About')

const routes = [
  {
    path: '/',
    name: 'DefaultHome',
    component: Home,
    meta:{
      title:'图书兄弟'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{
      title:'图书兄弟'
    }

  },

  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta:{
      title:'分类页面'
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta:{
      title:'商品详情'
    }

  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta:{
      title:'个人中心',
      isAuthRequired : true
    }
  },
  {
    path: '/shopcart',
    name: 'Shopcart',
    component: Shopcart,
    meta:{
      title:'图书兄弟-购物车',
      isAuthRequired : true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      title:'用户注册'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title:'用户登录'
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta:{
      title:'地址管理',
      isAuthRequired:true,
    }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta:{
      title:'地址编辑',
      isAuthRequired:true
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: Order,
    meta: {
      title:'生成订单',
      isAuthRequired:true
    }
  },
  {
    path: '/createorder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta:{
      title:'订单预览',
      isAuthRequired:true
    }
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title:'订单详情',
      isAuthRequired:true
    }
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    meta: {
      title:'账户设置',
      isAuthRequired:true
    }
  },
  {
    path: '/changename',
    name: 'ChangeName',
    component: ChangeName,
    meta: {
      title:'修改昵称',
      isAuthRequired:true
    }
  },
  {
    path: '/changeemail',
    name: 'ChangeEmail',
    component: ChangeEmail,
    meta: {
      title:'修改邮箱',
      isAuthRequired:true
    }
  },
  {
    path: '/bindphone',
    name: 'BindPhone',
    component: BindPhone,
    meta: {
      title:'手机绑定',
      isAuthRequired:true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title:'关于我们',
      isAuthRequired:true
    }
  },

  {
    path: '/changepassword',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: {
      title:'修改密码',
      isAuthRequired:true
    }
  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      title:'找回密码',
    }
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.meta.isAuthRequired && store.state.user.isLogin == false){
    // Toast.fail("请先登录");
    return next('/login');
  }
  else {
    next();
  }
})
export default router
