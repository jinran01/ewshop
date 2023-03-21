<template>
    <div>
        <Navbar>
            <template v-slot:default>用户登录</template>
        </Navbar>
        <div style="margin-top: 50px">
            <div style="text-align: center;padding: 50px" >
                <van-image
                    width="200"
                    src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                />
            </div>
        </div>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field
                    v-model="email"
                    type="email"
                    name="email"
                    label="email"
                    placeholder="email"
                    :rules="[{ required: true, message: '请填正确邮箱' }]"
                />
                <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                />

            </van-cell-group>
            <div style="margin: 16px;">
                <div class="link_login">
                    <i @click="$router.push({path:'/register'})">未有账号，立即注册</i>
                    <i @click="$router.push({path:'/resetpassword'})">忘记密码</i>
                </div>

                <van-button round block type="primary" native-type="submit">
                    登录
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import {ref, reactive, toRefs} from "vue";
import { Notify,Toast} from 'vant';
import {login} from "@/network/user"
import {useRouter} from "vue-router";
import {useStore} from "vuex"

export default {
    name: "Login",
    components:{
        Navbar,
    },
    setup(){
        const router = useRouter();
        const store = useStore();
        const userinfo = reactive({
            email:"",
            password:"",
        });
        const onSubmit = ()=>{
            login(userinfo).then(res=>{

                console.log(res.name)
                // 将token保存在本地 window.localStorage   setItem(key, value) getItem(key)

                window.localStorage.setItem('token',res.access_token)

              // console.log(store)
                store.commit('setIsLogin',true)
              // console.log(state.user.isLogin)
                Toast.success('登录成功');

                userinfo.password = "";
                userinfo.email = ""

                setTimeout(()=>{
                    router.push('/home')
                },1000)
                store.dispatch('updateCart');

            }).catch(err=>{
                console.log(err)
            })
        }
        return{
            ...toRefs(userinfo),
            onSubmit,
            userinfo,
        }
    }
}
</script>

<style scoped lang="scss">
    .link_login{
        font-size: 14px;
        margin-bottom: 40px;
        color: #42b983;
        top: 0;
        text-align: left;
        //padding-right: 50px;
        i:last-child{
            float: right;
        }
    }
</style>
