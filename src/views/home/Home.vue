<template>
    <div id="home">
        <Navbar>
            <template v-slot:default>图书兄弟</template>
        </Navbar>

        <TabControl v-show="isTabFixe" @tabClick="tabClick" :titles="['畅销','新书','精品']"></TabControl>

        <div class="wrapper">
            <div class="content">
                <div ref="banref">
                    <HomeSwiper :banners="banners">

                    </HomeSwiper>
<!--                    <div class="banners">-->
<!--                        <img src="@/assets/images/1.png">-->
<!--                    </div>-->
                    <Recommend :recommends="recommends">
                    </Recommend>
                </div>

                <TabControl @tabClick="tabClick" :titles="['畅销','新书','精品']">

                </TabControl>
                <GoodsList :goods="showGoods"></GoodsList>
            </div>
        </div>
        <back-top v-show="show_back_top" @Btop="Btop"></back-top>

    </div>

</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import Recommend from "@/views/home/ChildComps/Recommend";
import TabControl from "@/components/content/tabconrtol/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";
import BackTop from "@/components/common/backtop/BackTop";
import HomeSwiper from "@/views/home/ChildComps/HomeSwiper";
import {getHomeAllData,getHomeAllGoods} from "@/network/home";
import {ref, reactive, onMounted, computed, watchEffect, nextTick} from "vue";
import BScroll from 'better-scroll'
export default {
    name: "Home",
    setup(){

        let isTabFixe = ref(false);
        let banref = ref(null);
        let show_back_top = ref(false);

        const recommends = ref([]);
        //商品列表数据模型
        const goods = reactive({
            sales:{page:1,list:[]},
            new:{page:1,list:[]},
            recommend:{page:1,list:[]},
        });

        let currentType = ref('sales');

        const showGoods = computed(()=>{
            return goods[currentType.value].list
        });

        let bscroll = reactive({});
        let banners = ref([]);
        onMounted(()=>{

            getHomeAllData().then(res=>{
                recommends.value = res.goods;
                banners.value = res.slides;
            })

            getHomeAllGoods('sales').then(res=>{
                goods.sales.list = res.goods;
            })
            getHomeAllGoods('recommend').then(res=>{
                goods.recommend.list = res.goods;
            })
            getHomeAllGoods('new').then(res=>{
                goods.new.list = res.goods;
            })

            //创建BetterScroll对象
                bscroll = new BScroll(document.querySelector('.wrapper'),{
                probeType:3,    //0,1,2,3   3只要在运动就会触发scroll事件
                click:true,     //是否允许点击
                pullUpLoad:true,        //上拉加载更多，默认为false
            });

            //触发滚动事件
            bscroll.on('scroll',(position)=>{

                show_back_top.value = isTabFixe.value = (-position.y) > banref.value.offsetHeight;
            });

            // 上拉加载 触发pullingUp
           bscroll.on('pullingUp',()=>{
               const page = goods[currentType.value].page + 1;
               getHomeAllGoods(currentType.value,page).then(res=>{
                   goods[currentType.value].list.push(...res.goods.data);
                   goods[currentType.value].page += 1;
               });
               //加载完成 展示数据
               bscroll.finishPullUp()
               bscroll.refresh();
           })
        });
        const tabClick = (index)=> {

            let types = ['sales', 'new', 'recommend'];
            currentType.value = types[index];

            watchEffect(()=>{
                nextTick(() => {
                    //重新计算高度
                    bscroll && bscroll.refresh();
                });
            })

        }
        const Btop = ()=>{
            bscroll.scrollTo(0,0,800)
        }
        return{
            recommends,
            tabClick,
            goods,
            showGoods,
            isTabFixe,
            banref,
            show_back_top,
            Btop,
            HomeSwiper,
            banners,
        }
    },
    components:{
        HomeSwiper,
        Navbar,
        Recommend,
        TabControl,
        GoodsList,
        BackTop,
    },
    methods:{

    }
}
</script>

<style scoped lang="scss">
    .banners img{
        width: 100%;
        height: auto;
        //margin-top: 45px;
    }
    #home{
        height: 100vh;
        position: relative;
    }
    .wrapper{
        position: absolute;
        top: 45px;
        bottom: 50px;
        left: 0;
        right: 0;
        overflow: hidden;
    }
</style>
