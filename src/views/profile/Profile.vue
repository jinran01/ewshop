<template>
    <div>
        <Navbar>
            <template v-slot:default>个人中心</template>
        </Navbar>
        <div class="user-box">
            <div class="user-info">
                <div class="info">
<!--                  <van-uploader id="img" v-model="fileList" :max-count="1" :deletable="false" />-->
                    <img id="img" :src="user.avatar_url"/>

                    <div class="user-desc">
                        <span>昵称：{{user.name}}</span>
                        <span>登录名：{{user.email}}</span>
                        <span class="name">个性签名：我的剑就是你的剑</span>
                    </div>
                </div>
            </div>
        </div>

        <ul class="user-list">
            <li class="van-hairline--bottom" @click="goTo('/collect')">
                <span>我的收藏</span>
                <van-icon name="arrow" />
            </li>
            <li class="van-hairline--bottom" @click="goTo('/order')">
                <span>我的订单</span>
                <van-icon name="arrow" />
            </li>
            <li class="van-hairline--bottom"  @click="goTo('/setting')">
                <span>账户设置</span>
                <van-icon name="arrow" />
            </li>
            <li class="van-hairline--bottom"  @click="goTo('/address')">
                <span>地址管理</span>
                <van-icon name="arrow" />
            </li>
            <li class="van-hairline--bottom"  @click="goTo('/about')">
                <span>关于我们</span>
                <van-icon name="arrow" />
            </li>
        </ul>

        <div id="logout">
            <van-button @click="tologout" round block style="background-color:#42b983;color:white">
                退出
            </van-button>

<!--            <van-button @click="test" round block style="background-color:#42b983;color:white">-->
<!--                解锁-->
<!--            </van-button>-->
        </div>
    </div>
</template>

<script>

import {getUser, logout} from "@/network/user";
import {Toast} from "vant";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {onMounted, reactive, ref, toRefs} from "vue";
import Navbar from "@/components/common/navbar/Navbar";
// import {test1,test2} from "@/network/profile";



export default {
    name: "Profile",
    components:{
        Navbar
    },
    setup(){
        const store = useStore();
        const router = useRouter();
        const state = reactive({
            user:{}
        })


        onMounted(()=>{
            getUser().then(res=>{
                console.log(res);
                state.user = res
            })
        })
        // const test = () => {
        //     let params = reactive({
        //         user:'2859'
        //     })
        //     test1(params).then(res=>{
        //         console.log(res)
        //     })
        // }
        const tologout = () => {
          logout().then(res=>{
            // console.log(res)
              if(res.code == '200'){

                  // Toast.success(res.message)
                  //清除token
                  window.localStorage.setItem('token','');
                  store.commit('setIsLogin',false)
                  Toast.success(res.message)
                  setTimeout(()=>{
                    router.push({path:'/login'})
                  },500)
                  // location.reload();
              }
          })
        }

        // 跳转方法
        const goTo = (path, query) => {
            router.push({path, query:query || {}});
        }
        return{
            ...toRefs(state),
            tologout,
            goTo,

            // test
        }
    }
}
</script>

<style scoped lang="scss">
.user-info {
    width: 94%;
    height: 118px;
    background: linear-gradient(90deg, #31c7A7, #A1c7c7);
    box-shadow: 0 2px 5px #269090;
    border-radius: 6px;
    margin: 50px 10px 10px;
    text-align: left;
    .info {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        padding: 25px 20px;
        overflow: hidden;
        img {
            width:70px;
            height:75px;
            border-radius: 35%;
            margin-top: 4px;

        }
        .user-desc {
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            line-height: 20px;
            font-size: 14px;
            color: #fff;
            span {
                color: #fff;
                font-size: 14px;
                padding: 3px 0;
            }
        }


    }
}
.user-list {

    padding: 0 8px;
    margin-top: 40px;

    li {
        padding-left:8px;
        padding-right:5px;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        .van-icon-arrow {
            margin-top: 13px;
        }
        margin:20px 0 !important;
        background: #FFFFFF;
        border-radius: 3px;
    }

}
#logout{
    margin: auto;
    width: 210px;
}
</style>
