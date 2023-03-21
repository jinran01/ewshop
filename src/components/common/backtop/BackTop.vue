<template>
    <div class="back_top" @click="backtop"></div>
</template>

<script>
export default {
    name: "BackTop",
    setup(props,{emit}){
        return{
            backtop:()=>{
                emit('Btop');
            }
        }
    }
}
</script>

<style scoped>
    .back_top{
        width: 40px;
        height: 40px;
        position: fixed;
        bottom: 80px;
        right: 20px;
        z-index: 5;
        box-shadow: 5px 5px 5px #666666;
        border-radius: 50%;
        background: url("@/assets/images/up.png") no-repeat center center;
        cursor: pointer;
    }
</style>
