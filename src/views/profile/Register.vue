<template>
    <div>
        <Navbar>
            <template v-slot:default>用户注册</template>
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
                    v-model="name"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                />
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
                <van-field
                    v-model="password_confirmation"
                    type="password"
                    name="确认密码"
                    label="确认密码"
                    placeholder="确认密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                />
            </van-cell-group>
            <div style="margin: 16px;">
                <div class="link_login">
                    <i @click="$router.push({path:'/login'})">已有账号，立即登录</i>
                </div>
                <van-button round block type="primary" native-type="submit">
                    注册
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import {ref, reactive, toRefs} from "vue";
import { Notify,Toast} from 'vant';
import {register} from "@/network/user"
import {useRouter} from "vue-router";
export default {
    name: "Register",
    components:{
        Navbar,
    },
    setup(){
        const router = useRouter();
        const userinfo = reactive({
            name:"",
            email:"",
            password:"",
            password_confirmation:"",
        });
        const onSubmit = ()=>{
            if(userinfo.password != userinfo.password_confirmation){
                Notify({
                    message: '两次输入的密码不一致',
                    position: 'center',
                });
            }
            else {
                 register(userinfo).then(res=>{
                     console.log(res.status)
                    if(res.status == '201'){
                        Toast.success('注册成功');
                        setTimeout(()=>{
                            router.push({path:'/login'})
                        },1000)
                    }
                    userinfo.password = "";
                    userinfo.password_confirmation = "";
                })
            }
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
    }
</style>
