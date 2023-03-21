<template>
    <div class="create-order">
        <Navbar class="nav-bar">
            <template v-slot:default>
                定单预览
            </template>
        </Navbar>

        <div class="address-wrap" @click="goTo">
            <div class="address">
                <div>{{ city_name.str}}</div>
                <div>{{ addresses.address }}</div>
            </div>

            <div class="name">
                <span>{{addresses.name}}</span>
                <span>{{addresses.phone}}</span>
            </div>

            <van-icon class="arrow" name="arrow" />
        </div>
        <div class="good">
            <div class="good-item" v-for="(item, index) in cartList" :key="index">
                <div class="good-img"><img v-lazy="item.goods.cover_url" alt=""></div>
                <div class="good-desc">
                    <div class="good-title">
                        <span>{{item.goods.title}}</span>
                        <span>x{{item.num}}</span>
                    </div>
                    <div class="good-btn">
                        <div class="price"><small>¥</small> {{item.goods.price+'.00'}}</div>
                    </div>
                </div>
            </div>
        </div>

        <van-submit-bar
            class="submit-all"
            :price="total * 100"
            button-text="生成订单"
            @submit="handleCreateOrder"
        >
            商品金额
        </van-submit-bar>

        <van-popup
            closeable
            :close-on-click-overlay="false"
            v-model:show="showPay"
            position="bottom"
            :style="{ height: '40%' }"
            @close="close"
        >

            <van-grid :border="false" :column-num="2">
                <van-grid-item>
                    支付宝二维码<br>
                    <van-image width="150" height="150" :src="aliyun" />
                </van-grid-item>
                <van-grid-item>
                    微信二维码<br>
                    <van-image width="150" height="150" :src="wechat" />
                </van-grid-item>

            </van-grid>

        </van-popup>
    </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import { reactive, onMounted, toRefs, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {useStore} from 'vuex';
import {Toast} from "vant";
import {createOrder, getOrderPreview, payOrder, payOrderStatus} from "@/network/order";

export default {
    components: {
        Navbar
    },
    setup() {
        const router = useRouter()
        const store = useStore()
        const state = reactive({
            cartList: [],
            addresses: {},
            showPay:false,
            orderNo:'',
            aliyun:'',
            wechat:'',
            city_name:{},


        })

        const init = ()=>{
            Toast.loading({message:'加载中...', forbidClick:true});

            getOrderPreview().then(res=>{
                let chosenAddressId = window.localStorage.getItem('chosenAddressId')

                const address = res.address.filter(n=>n.id == chosenAddressId)
                // console.log(address)
                if(chosenAddressId) {
                    state.addresses = address[0];
                    state.city_name = address[0].city_name
                }
                else{
                    let address = res.address.filter(n=>n.is_default == '1')
                    if(address.length != 0){
                        state.addresses = address[0];
                        // state.address = address[0];
                        state.city_name = address[0].city_name
                    }
                    else {
                        state.addresses = {
                            address: '还没有设置默认地址，请选择或填写地址信息'
                        }
                    }

                }
                state.cartList = res.carts;
                Toast.clear();

            })
        }

        onMounted(() => {
            init();
        })


        const goTo = () => {
            router.push({path: '/address', query:{getAddressId_flag:'1'}})
        }


        const handleCreateOrder = () => {
            const params = {
                address_id: state.addresses.id
            }
            createOrder(params).then(res=>{

                Toast('创建定单成功');
                store.dispatch('updateCart');
                state.showPay = true;
                // 订单ID
                state.orderNo = res.id;

                payOrder(state.orderNo, {type:'aliyun'}).then(res=>{
                    const url = "http://apis.juhe.cn/qrcode/api?key=50772c24ecb2dc87083323576855874d&type=2&fgcolor=00b7ee&w=90&m=5&text="+res.qr_code
                    state.aliyun = url;
                    state.wechat = url;
                    // state.aliyun = res.qr_code;
                    // state.wechat = res.qr_code;
                })

                /* payOrder(state.orderNo, {type:'wechat'}).then(res=>{
                     console.log(res);
                     state.wechat = res.qr_code_url;
                 })*/

                // 轮询查看
                const timer = setInterval(()=>{
                    payOrderStatus(state.orderNo).then(res=>{
                        console.log(res)
                        if(res == '2') {
                            clearInterval(timer);
                            router.push({path:'/orderdetail', query:{id:state.orderNo}})
                        }
                    })
                }, 2000)
            })

        }

        const close = () => {
            router.push({path:'/orderdetail', query:{id:state.orderNo}})
        }

        const total = computed(()=>{
            let sum = 0;
            state.cartList.forEach(item=>{
                sum += parseInt(item.num) * parseFloat(item.goods.price);
            })
            return sum;
        })

        return {
            ...toRefs(state),
            goTo,
            handleCreateOrder,
            close,
            total
        }
    }
}
</script>

<style lang="scss" scoped>
.create-order {
    background: #f9f9f9;
    .address-wrap {
        text-align: left;
        margin-bottom: 20px;
        background: white;
        position: relative;
        margin-top: 44px;
        font-size: 12px;
        padding: 15px;
        color: #222333;
        .name{
            margin: 5px 0 ;
        }
        .address>div:last-child{
            margin-top: 5px;
            font-weight: bold;
            font-size: 18px;
            //word-spacing: 100px;
            letter-spacing: 5px
        }

        .arrow {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
        }
        &::before {
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            height: 2px;
            background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
            background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
            background-size: 80px;
            content: '';
        }
    }
    .good {
        //border: 1px solid red;
        margin-bottom: 120px;
    }
    .good-item {
        background-color: white;
        //border: 2px solid red;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        margin-top:10px;
        .good-img {
            img {
                width:100px;
                height:auto;
            }
        }
        .good-desc {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            padding: 20px;
            .good-title {
                display: flex;
                justify-content: space-between;
            }
            .good-btn {
                display: flex;
                justify-content: space-between;
                .price {
                    font-size: 16px;
                    color: red;
                    line-height: 28px;
                }
                .van-icon-delete {
                    font-size: 20px;
                    margin-top: 4px;
                }
            }
        }
    }
    .pay-wrap {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
        padding: 10px 0;
        padding-bottom: 50px;
        border-top: 1px solid #e9e9e9;
        >div {
            display: flex;
            justify-content: space-between;
            padding: 0 5%;
            margin: 10px 0;
            font-size: 14px;
            span:nth-child(2) {
                color: red;
                font-size: 18px;
            }
        }
        .pay-btn {
            position: fixed;
            bottom: 7px;
            right: 0;
            left: 0;
            width: 90%;
            margin: 0 auto;
        }
    }
}
.submit-all {
    margin-bottom: 50px;
    z-index: 9 !important;
}
</style>
