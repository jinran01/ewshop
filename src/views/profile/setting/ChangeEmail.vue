<template>
    <div class="changeemail-box" id="changeemail-box">
        <Navbar v-slot:default>修改邮箱</Navbar>
        <div class="change-box">
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-field
                        id="test"
                        v-model="email"
                        name="email"
                        type="email"
                        label="邮箱"
                        placeholder="请输入邮箱"
                        :rules="[{ required: true, message: '请填写邮箱' }]"
                    />


                    <van-field

                        v-model="emailcode"
                        name="emailcode"
                        center
                        clearable
                        label="验证码"
                        placeholder="请输入邮箱验证码"
                        :rules="[{ required: true, message: '请填写验证码' }]"
                   >
                        <template #button>
                            <van-button :disabled="flag_btn" size="small" type="primary"  style="background: #42b983;border: #42b983;"
                                        @click="sendcode">
                                {{content}}
                                <van-count-down v-if="flag" :time="time" format="ss 秒" />

                            </van-button>

                        </template>
                    </van-field>
                </van-cell-group>
                <div style="margin-top: 30px;margin-left: 100px">
                    <van-button round block type="primary" native-type="submit"
                                style="background: #42b983;border: #42b983;width: 180px;" >
                        提交
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import {getEmailCode,ChangeEmail} from "@/network/profile";
import {onMounted, reactive, ref, toRefs} from "vue";
import {Notify, Toast} from "vant";
import {useRouter} from "vue-router";

export default {
    name: "ChangeEmail",
    components:{
        Navbar
    },
    setup(){
        const router = useRouter()
        const email = ref('');
        const emailcode = ref('');
        const params = reactive({
            code:'',
            email:'',
        })
        const time = ref(60*1000)
        const state = reactive({
            flag:false,
            flag_btn:false,
            content:'发送验证码',
        })
        const  init = ()=>{
            setInterval(()=>{
                const time  = new Date().getTime()
                if (time - window.localStorage.getItem('sendemailetime') < 60*1000){
                    state.flag_btn = true;
                }
                if(time - window.localStorage.getItem('sendemailetime') > 60*1000){
                    state.flag_btn = false;
                    state.content='发送验证码';
                }
                // console.log(window.localStorage.getItem('sendtime'))
            },1000)
        }
        onMounted(()=>{
            init();
        })


        const sendcode = (event) => {

            // console.log(window.localStorage.getItem('sendtime'))
            if (email.value){
                params.email = email.value
                getEmailCode(params).then(res=>{
                    if (res.status == '204'){
                        state.flag_btn = true;
                        state.flag =true;
                        state.content='';
                        let time = new Date().getTime()
                        window.localStorage.setItem('sendemailetime',time)
                        // console.log(event.target.childNodes[0].innerText)
                        setInterval(()=>{
                            if(event.target.childNodes[0].innerText == '00 秒'){
                                state.flag_btn = false;
                                state.flag =false;
                                state.content='发送验证码';
                            }
                        },1000)
                        Toast.success('发送成功，请查收')
                    }
                })
            }
            else {
                Notify({message:'邮箱有误',position:'center'})
            }
        }



        const onSubmit = (content) => {
            params.email = content.email
            params.code = content.emailcode
            ChangeEmail(params).then(res=>{
                if (res.status == '204'){
                    Toast.success('修改成功')
                    router.back()
                }
            })
        }




        return{
            emailcode,
            email,
            onSubmit,
            time,
            sendcode,
            ...toRefs(state)

        }
    }
}
</script>

<style scoped lang="scss">
    .changeemail-box{
        margin-top: 50px;
    }
</style>
