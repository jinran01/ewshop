<template>
    <div class="restpassword-box">
        <Navbar v-slot:default>
            找回密码
        </Navbar>
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
                            <van-button  size="small" type="primary"  style="background: #42b983;border: #42b983;"
                                         @click="sendcode">
                                发送验证码
                            </van-button>
                        </template>
                    </van-field>
                    <van-field
                        v-model="password"
                        name="password"
                        type="password"
                        label="新密码"
                        placeholder="请输入密码"
                        :rules="[{ required: true, message: '请填写密码' }]"
                    />
                    <van-field
                        v-model="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        label="确认密码"
                        placeholder="请输入密码"
                        :rules="[{ required: true, message: '请填写密码' }]"
                    />
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
import {useRouter} from "vue-router/dist/vue-router";
import {onMounted, reactive, ref} from "vue";
import {getResetCode,resetPassword} from "@/network/user";
import {Notify, Toast} from "vant";


export default {
    name: "ResetPassword",
    components:{
        Navbar
    },
    setup(){
        const router = useRouter()
        const email = ref('');
        const emailcode = ref('');
        const password = ref('');
        const password_confirmation = ref('');
        const params = reactive({
            code:'',
            email:'',
            password:'',
            password_confirmation:'',

        })

        const sendcode = () => {

            if (email.value){
                params.email = email.value
                getResetCode(params).then(res=>{
                    if (res.status == '204'){
                        Toast.success('发送成功，请查收')
                    }
                })
            }
            else {
                Notify({message:'邮箱有误',position:'center'})
            }
        }



        const onSubmit = (content) => {
            params.email = content.email;
            params.code = content.emailcode;
            params.password = content.password;
            params.password_confirmation = content.password_confirmation;
            resetPassword(params).then(res=>{
                if (res.status == '204'){
                    Toast.success('修改成功')
                    router.back()
                }
            })
        }



        return{
            emailcode,
            email,
            password,
            password_confirmation,
            onSubmit,
            sendcode
        }
    }
}
</script>

<style scoped lang="scss">

.restpassword-box{
    margin-top: 50px;
    .change-box{

    }
}
</style>
