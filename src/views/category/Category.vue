<template>
    <div>
        <Navbar>
            <template v-slot:default>商品分类</template>
        </Navbar>
        <div id="mainbox">
            <div class="ordertab">
                <van-tabs v-model:active="active" @click="tabClick">
                    <van-tab title="销量排序"></van-tab>
                    <van-tab title="价格排序"></van-tab>
                    <van-tab title="评价排序"></van-tab>
                </van-tabs>
            </div>

            <van-sidebar class="leftmenu" v-model="activeKey">
                <van-collapse v-model="activeName" accordion>
                    <van-collapse-item v-for="item in categories"
                                       :title="item.name"
                                       :key="item.id"
                                       :name="item.name">
                        <van-sidebar-item v-for="sub in item.children"
                                          :title="sub.name"
                                          :key="sub.id"
                                          @click="getGoods(sub.id)" />
                    </van-collapse-item>
                </van-collapse>

            </van-sidebar>

            <div class="goodslist">
                <div class="content">


                    <van-card
                        v-for="item in showGoods" :key="item.id"
                        @click="itemClick(item.id)"
                        :tag="item.comments_count >=0 ? '流行': '其他'"
                        :price="item.price+'.00'"
                        :desc="item.updated_at"
                        :title="item.title"
                        :thumb="item.cover_url"
                    />
                </div>
            </div>
        </div>

        <BackTop @Btop="Btop" v-show="isShowBackTop"></BackTop>
    </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import BackTop from "@/components/common/backtop/BackTop";
import BScroll from "better-scroll";
import {ref, reactive, onMounted, computed, watchEffect, nextTick} from "vue";
import {getcategory,getcategoryGoods} from "@/network/category";
import {useRouter} from "vue-router";


export default {
    name: "Category",
    setup(){

        const router = useRouter();

        let activeKey = ref(0);
        let categories = ref([]);
        let activeName = ref(1);
        let active = ref(0);
        let isShowBackTop = ref(false);

        //当前排序条件
        let currentOrder = ref('sales');

        //当前分类id
        let currentCid = ref(0);

        //数据模型
        const goods = reactive({
            sales:{page:1,list:[]},
            price:{page:1,list:[]},
            comments_count:{page:1,list:[]},
        })
        console.log(goods)
        const showGoods = computed(()=>{

            return goods[currentOrder.value].list;

        });

        const init = () => {
            getcategoryGoods('sales',currentCid.value,1).then(res=>{
                goods.sales.list = res.goods.data;

            });
            getcategoryGoods('price',currentCid.value,1).then(res=>{
                goods.price.list = res.goods.data;
            });
            getcategoryGoods('comments_count',currentCid.value,1).then(res=>{
                goods.comments_count.list = res.goods.data;
            })
        }

        let bscroll = reactive({});

        onMounted(()=>{
            getcategory().then(res=>{
                categories.value = res.categories;
            })
            init();

            //创建BetterScroll对象
            bscroll = new BScroll(document.querySelector('.goodslist'),{
                probeType:3,    //0,1,2,3   3只要在运动就会触发scroll事件
                click:true,     //是否允许点击
                pullUpLoad:true,        //上拉加载更多，默认为false
            })


            // 注册滚动事件
            bscroll.on('scroll', (position)=>{
                isShowBackTop.value = (-position.y) > 300
            })

            // 上拉加载 触发pullingUp
            bscroll.on('pullingUp',()=>{

                const page = goods[currentOrder.value].page + 1 ;



                getcategoryGoods(currentOrder.value, currentCid.value,page).then(res=> {
                    goods[currentOrder.value].list.push(...res.goods.data);

                    goods[currentOrder.value].page += 1;
                    if (page-1>=goods[currentOrder.value].page){
                        return false
                    }
                });


                //加载完成 展示数据
                bscroll.finishPullUp();

                // bscroll.refresh();
                //重新计算高度
                nextTick(()=>{
                    // 重新计算高度
                    bscroll &&  bscroll.refresh();
                });


            });
        });

        //排序选项卡
        const tabClick = (index)=>{

            let orders = ['sales','price','comments_count'];
            currentOrder.value = orders[index];

            getcategoryGoods(currentOrder.value,currentCid.value).then(res=>{
                goods[currentOrder.value].list = res.goods.data;
                nextTick(() => {
                    //重新计算高度
                    bscroll && bscroll.refresh();

                });
            });
        };

        //通过分类get 商品
        const getGoods = (cid)=>{
            currentCid.value = cid;
            init();

        };

        watchEffect(()=>{
            nextTick(() => {
                //重新计算高度
                bscroll && bscroll.refresh();
            });
        });

        const Btop = ()=>{
            bscroll.scrollTo(0, 0, 300);
        }

        return{
            bscroll,
            active,
            activeKey,
            activeName,
            categories,
            currentOrder,
            currentCid,
            goods,
            showGoods,
            isShowBackTop,
            Btop,
            tabClick,
            getGoods,
            itemClick(id){
                router.push({path:'/detail', query:{id}});
            },

        }
    },
    components:{
        Navbar,
        BackTop
    }
}
</script>

<style scoped lang="scss">
    #mainbox{
        margin-top: 45px;
        display: flex;
        .ordertab{
            flex: 1;
            float:right;
            height:50px;
            z-index: 9;
            position: fixed;
            top:45px;
            right:0;
            left:130px;

        }
        .leftmenu{
            width: 130px;
            position: fixed;
            top: 95px;
            left: 0;
        }
        .goodslist{
            flex:1;
            position: absolute;
            top:100px;
            left:130px;
            right:0;
            height:100vh;
            padding:10px;
            text-align: left !important;

        }

    }

</style>
