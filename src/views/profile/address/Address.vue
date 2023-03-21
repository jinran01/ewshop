<template>
    <div class="address-box">
        <Navbar class="nav-bar">
            <template v-slot:default>
                地址管理
            </template>
        </Navbar>
        <div v-show="list.length == 0" style="margin-top:200px;text-align: center;">
            还没有地址信息，去添加吧！
        </div>
        <div class="address-item" >
            <van-address-list
                @click="getAddressId"
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
            />
        </div>
    </div>
<!--    <van-area title="标题" :area-list="areaList" />-->

</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import {ref, onMounted, reactive, toRefs} from "vue";
import {addAddress, getAddressDetail, getAddressList} from "@/network/address";
import {useRouter,useRoute} from "vue-router";



export default {
    name: "Address",
    components:{
        Navbar
    },
    setup(){
        const route = useRoute();
        const router = useRouter();
        const state = reactive({
            chosenAddressId: '',
            list: []
        })
        onMounted(()=>{
            getAddressList().then(res=>{
                if(res.data.length == 0){
                    state.list=[];
                    return;
                }
                state.list =res.data.map(item=>{
                    return{
                        id:item.id,
                        name:item.name,
                        tel:item.phone,
                        address:`${item.city_name.str} ${item.address}`,
                        isDefault: item.is_default,
                    }

                })

            })
        })
        const onAdd = () => {
            router.push({ path: '/addressedit', query: { type: 'add'}})
        }

        const onEdit = (item) => {
            router.push({ path: '/addressedit', query: { type: 'edit', addressId: item.id }})
        }

        let {getAddressId_flag} = route.query;

        const getAddressId = () => {
            if(getAddressId_flag =='1'){
              // console.log(state);
                // console.log(state.chosenAddressId)
                getAddressDetail(state.chosenAddressId).then(res=>{
                window.localStorage.setItem('chosenAddressId',state.chosenAddressId)
                router.back()
            })}

        }



        return{
            ...toRefs(state),
            onAdd,
            onEdit,
            getAddressId

        }
    }

}
</script>

<style lang="scss">
.address-box {
    height:300px;
    .van-radio__icon {
        display: none;
    }
    .address-item {
        margin-top: 45px;

    }
    .van-button--danger{
        background: var(--color-tint);
        border-color: var(--color-tint);
    }
}
.van-address-list__bottom {
    bottom: 100px !important;

}
</style>
