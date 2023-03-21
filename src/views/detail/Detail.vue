<template>
    <div class="test">
        <Navbar>
            <template v-slot:default>商品详情</template>
        </Navbar>
        <van-image style="margin-top: 50px"
            width="100%"
            lazy-load
            :src="detail.cover_url"
        />
        <van-card style="text-align: left"
            :num="detail.stock"
            :price="detail.price+'.00'"
            :desc="detail.description"
            :title="detail.title"
        >
            <template #tags>
                <van-tag plain type="danger">新书</van-tag>
                <van-tag plain type="danger">推荐</van-tag>
            </template>
            <template #footer>
                <van-button type="danger" @click="goToCart">立即购买</van-button>
                <van-button type="warning" @click="handleAddCart">加入购物车</van-button>
            </template>
        </van-card>
        <van-tabs v-model:active="active">
            <van-tab title="概述">
                <div class="comtent" v-html="detail.detail">

                </div>
                <div style="width: 100%;height: 45px;">

                </div>
            </van-tab>
            <van-tab title="热评">
<!--                <div class="comments" v-for="content in detail.comments" :key="content">-->
<!--                    -->
<!--                </div>-->
            </van-tab>
            <van-tab title="相关图书">
                <GoodsList :goods="like_goods" @click="goDe"></GoodsList>
            </van-tab>
            <div style="width: 100%;height: 45px;">

            </div>
        </van-tabs>

    </div>

</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import {ref, reactive, onMounted, toRefs, nextTick} from "vue";
import GoodsList from "@/components/content/goods/GoodsList";
import {useRoute,useRouter} from "vue-router";
import {getDtail} from "@/network/detail";
import {addCart} from "@/network/cart";
import BackTop from "@/components/common/backtop/BackTop";
import {Toast} from "vant";
import {useStore} from "vuex";



export default {
    name: "Detail",
    components:{
        Navbar,
        GoodsList,
        BackTop
    },
    setup(){

        let active = ref(0);
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        let id = ref(0);
        let book =reactive({
            detail:{},
            like_goods:{},
            comments:{},
        })
        let bscroll = reactive({});
        onMounted(()=>{

            id.value = route.query.id;
            getDtail(id.value).then(res=>{
                console.log(res)
                book.detail = res.good;
                book.like_goods = res.like_good;
            })

        })

        //添加购物车
        const handleAddCart = () => {
            addCart({goods_id:book.detail.id,num:1}).then(res=>{
                console.log(res.status)
                if(res.status =='204' || res.status =='201'){
                    Toast.success('添加成功');

                    //设置store中的cartcount
                    store.dispatch('updateCart')
                    // router.push({path:'/shopcart'})
                }
            })

        }


        //立即购买
        const goToCart = () => {
            addCart({goods_id:book.detail.id,num:1}).then(res=>{
                console.log(res.status)
                if(res.status =='201' || res.status =='204'){

                    //设置store中的cartcount
                    store.dispatch('updateCart')
                    router.push({path:'/shopcart'})

                }
            })
        }

        // location.reload()

        const goDe = () => {
            location.reload()
        }

        const Btop = ()=>{
            bscroll.scrollTo(0, 0, 300);
        }
        return{
            id,
            ...toRefs(book),
            active,
            goDe,
            Btop,
            bscroll,
            handleAddCart,
            goToCart,

        }
    }
}
</script>

<style scoped>

</style>
