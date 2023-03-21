<template>
    <div class="goods">
        <GoodsListItem v-for="item in goods" :product="item" :key="item"></GoodsListItem>
    </div>
</template>

<script>
import GoodsListItem from "@/components/content/goods/GoodsListItem";
export default {
    name: "GoodsList",
    props:{
        goods:{
            type:Array,
            default(){
                return [];
            }
        }
    },
    components:{
        GoodsListItem,
    }
}
</script>

<style scoped lang="scss">
    .goods{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding: 5px;
    }
</style>
