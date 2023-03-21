<template>
    <div class="nav-bar">
        <div class="left" @click="goback"><slot name="left">
            <img src="@/assets/images/left.png" alt=""></slot>
        </div>
        <div class="mid"><slot>EWshop</slot></div>
        <div class="right"><slot name="right"></slot></div>
    </div>
</template>

<script>
import {useRouter} from "vue-router";

export default {
    name: "Navbar",
    setup(){
        const  router = useRouter();

        const goback = () => {
            router.go(-1);
        }
        return{

            goback
        }
    }
}
</script>

<style scoped>
    .nav-bar{
        display: flex;
        background-color: var(--color-tint);
        color: #FFFFFF;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9;
        height: 45px;
        line-height: 45px;
        box-shadow: 0 2px 0px rgba(100,100,100,0.1);
    }
    .left,.right{
        width: 60px;
    }
    .left img{
        width: 50px;
        padding: 15px;
        cursor: pointer;
    }
    .mid{
        /*background-color: red;*/
        flex: 1;
    }
</style>
