<template>
    <div class="changename-box">
        <Navbar v-slot:default>修改昵称</Navbar>
        <div class="change-box">
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-field
                        v-model="name"
                        name="name"
                        label="昵称"
                        placeholder="请输入昵称"
                        :rules="[{ required: true, message: '请填写昵称' }]"
                    />
                </van-cell-group>
                <div style="margin-top: 30px;margin-left: 100px">
                    <van-button round block type="primary" native-type="submit"
                                style="background: #42b983;border: #42b983;width: 180px;" >
                        保存
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>

</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import {onMounted, ref} from "vue";
import {ChangeNmae} from "@/network/profile";
import {Toast} from "vant";
import router from "@/router";
import {useRouter} from "vue-router";

export default {
    name: "ChangeName",
    components:{
        Navbar
    },
    setup(){
        const router = useRouter();
        const name = ref('');
        const onSubmit = (content) => {
            let params = {
                name:{}
            }
            params.name = content.name
            ChangeNmae(params).then(res=>{
                console.log(content.name)
                Toast.success('修改成功');
                router.back();
            })
        }

        return {
            onSubmit,
            name,
        }

    }

}
</script>

<style scoped lang="scss">

    .changename-box{
        margin-top: 50px;
        .change-box{

        }
    }
</style>
