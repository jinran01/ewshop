<template>
    <div class="changepassword-box">
        <Navbar v-slot:default>修改密码</Navbar>
        <div class="change-box">
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-field
                        v-model="old_password"
                        name="old_password"
                        type="password"
                        label="旧密码"
                        placeholder="请输入旧密码"
                        :rules="[{ required: true, message: '请填写旧密码' }]"
                    />
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
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router/dist/vue-router";
import {ChangePassword} from "@/network/profile";
import {Toast} from "vant";


export default {
    name: "ChangePassword",
    components:{
        Navbar
    },
    setup(){
        const router = useRouter()
        const old_password = ref('');
        const password = ref('');
        const password_confirmation = ref('');
        const params = reactive({
            old_password:'',
            password:'',
            password_confirmation:'',

        })


        const onSubmit = (content) => {
            params.old_password = content.old_password
            params.password = content.password
            params.password_confirmation = content.password_confirmation
            ChangePassword(params).then(res=>{
                if (res.status == '204'){
                    Toast.success('修改成功')
                    window.localStorage.setItem('token','')
                    setTimeout(()=>{
                      router.back()
                    },500)
                    // router.back()
                }
            })
        }

        // const time = ref(60*1000)


        return{
            old_password,
            password,
            password_confirmation,
            onSubmit,

        }
    }
}
</script>

<style scoped lang="scss">
.changepassword-box{
    margin-top: 50px;
}
</style>
