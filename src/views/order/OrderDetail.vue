<template>
    <div class="order-detail-box">
        <Navbar class="nav-bar">
            <template v-slot:default>
                定单详情
            </template>
        </Navbar>
        <div class="order-status">
            <div class="status-item">
                <label>订单状态：</label>
                <span>{{statusString}}</span>
            </div>
            <div class="status-item">
                <label>订单编号：</label>
                <span>{{detail.order_no}}</span>
            </div>
            <div class="status-item">
              <label>交易单号：</label>
              <span>{{detail.trade_no}}</span>
            </div>
            <div class="status-item">
                <label>下单时间：</label>
                <span>{{detail.created_at}}</span>
            </div>

            <van-button v-if="detail.status == 1"  @click="showPayFn" style="margin-bottom: 10px" color="#1baeae" block>去支付</van-button>
            <van-button v-if="detail.status == 3"  @click="handleConfirmOrder" block >确认收货</van-button>
        </div>
        <div class="order-price">
            <div class="price-item">
                <label>商品金额：</label>
                <span>¥ {{detail.amount+ '.00'}}</span>
            </div>
            <div class="express-item">
                <label v-if="detail.status == 3 || detail.status == 4">配送方式：{{ express.ShipperCode }}快递</label>
                <label v-if="detail.status == 1 || detail.status == 2 ||detail.status == 5">配送方式：普通快递</label>
                <van-steps direction="vertical" active="0" active-icon="checked" active-color="red" inactive-icon="logistics" >
                  <van-step v-for="(item, index) in express.Traces" :key="index">
                    <h2>{{item.Remark}}</h2>
                    <h3>{{item.AcceptStation}}</h3>
                    <p>{{item.AcceptTime}}</p>
                  </van-step>
                </van-steps>
            </div>
        </div>

        <van-card
            v-for="item in detail.orderDetails.data" :key="item.id"
            :num="item.num"
            :price="item.goods.price+'.00'"
            desc="全场包邮"
            :title="item.goods.title"
            :thumb="item.goods.cover_url"
        />

        <div style="width:100%;height:50px;">

        </div>

        <van-popup
            v-model:show="showPay"
            position="bottom"
            :style="{ height: '40%' }"
        >

            <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0' }">
                <van-grid :border="false" :column-num="2">
                    <van-grid-item  text="支付宝">
                        支付宝二维码<br>
                        <van-image width="150" height="150" :src="aliyun" />
                    </van-grid-item>
                    <van-grid-item text="微信支付">
                        微信二维码<br>
                        <van-image width="150" height="150" :src="wechat" />
                    </van-grid-item>
                </van-grid>

            </div>
        </van-popup>

    </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import {useRouter,useRoute} from "vue-router";
import {computed, onMounted, reactive, toRefs} from "vue";
import {confirmOrder, getOrderDetail, payOrder, payOrderStatus,getOrderExpress} from "@/network/order";
import {Dialog, Toast,Step,Steps} from "vant";

export default {
    name: 'OrderDetail',
    components: {
        Navbar,
        Step,
        Steps
    },
    setup() {

        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            orderNo:'',  // 定单ID
            detail:{
                orderDetails:{
                    data:[]
                },
                status:0,
                express:{}
            },
            express:{},
            showPay:false,
            aliyun:'',
            wechat:''
        })

        const init = () =>{
            const {id} =  route.query;
            state.orderNo = id;
            getOrderExpress(id).then(res=>{
                state.express = res
                console.log(res)
            })
            getOrderDetail(id).then(res=>{
                state.detail = res;
                console.log(state.detail)
            })

        }

        onMounted(() => {
            Toast.loading({message:'加载中...', forbidClick:true});
            init();
            Toast.clear();
        })

        const statusString = computed(()=>{
            // 1下单 2支付 3发货 4收货 5过期
            let status = ['', '已下单', '已支付', '已发货', '确认收货', '已过期'];
            return status[state.detail.status];
        })

        // const total = computed(()=>{
        //     let sum = 0;
        //     state.detail.orderDetails.data.forEach(item=>{
        //         sum += item.num * item.price;
        //     })
        //     return sum;
        // })

        const showPayFn = () =>{
            state.showPay = true;
            payOrder(state.orderNo, {type:'aliyun'}).then(res=>{
                const url = "http://apis.juhe.cn/qrcode/api?key=50772c24ecb2dc87083323576855874d&type=2&fgcolor=00b7ee&w=90&m=5&text="+res.qr_code
                state.aliyun = url;
                state.wechat = url;
                // url = ''
                // state.aliyun = res.qr_code;
                // state.wechat = res.qr_code;
            })

            // 轮询查看
            const timer = setInterval(()=>{
                payOrderStatus(state.orderNo).then(res=>{
                    console.log(res);
                    if(res == '2') {
                        clearInterval(timer);
                        state.showPay = false;
                        location.reload();
                        router.push({path:'/orderdetail', query:{id:state.orderNo}})
                    }
                })
            }, 2000)

        }

        const handleConfirmOrder = ()=>{
            Dialog.confirm({
                title:'是否确认订单'
            }).then(()=>{
                confirmOrder(state.orderNo).then(res=>{
                    Toast('确认成功');
                    init();
                })
            }).catch(()=>{

            })
        }

        const close = () =>{
            Dialog.close();
        }

        return {
            ...toRefs(state),
            statusString,
            showPayFn,
            handleConfirmOrder,
            close,

        }




    }
}
</script>

<style lang="scss" scoped>
.order-detail-box {
    text-align: left;
    background: #f7f7f7;
    .order-status {
        background: #fff;
        margin-top: 44px;
        padding: 20px;
        font-size: 15px;
        .status-item {
            margin-bottom: 10px;
            label {
                color: #999;
            }
            span {

            }
        }
    }
    .order-price {
        background: #fff;
        margin: 20px 0;
        padding: 20px;
        font-size: 15px;
        .price-item {
            margin-bottom: 10px;
            label {
                color: #999;
            }
            span {

            }
        }
    }
    .van-card {
        margin-top: 0;
    }
    .van-card__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .express-item{
        --van-step-font-size: 10px;
    }
}
</style>
