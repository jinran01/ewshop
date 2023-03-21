<template>
    <div class="tab-control">
        <div v-for="(item,index) in titles" :key="index"
             @click="itemClick(index)"
             class="tab-control-item"
             :class="{active:index == currenIndex}">
            <span>{{ item }}</span>
        </div>
    </div>
</template>

<script>
import {ref} from "vue";
export default {
    name: "TabControl",
    props:{
        titles:{
            type:Array,
            default() {
                return [];
            }
        }
    },
    setup(props,{emit}){
        let currenIndex = ref(0);
        const itemClick = (index)=>{
            currenIndex.value = index;
            emit('tabClick',index);
        };
        return{
            currenIndex,
            itemClick
        }
    }
}
</script>

<style scoped lang="scss">
    .tab-control{
        display: flex;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        background-color: #FFFFFF;
        width: 100%;
        position: sticky;
        top: 45px;
        z-index: 9;
        .tab-control-item{
            flex: 1;
            cursor: pointer;
            span{
                padding: 5px;
            }
        }
        .active{
            color: var(--color-tint);
            border-bottom: 3px solid var(--color-tint);

        }
    }
</style>
