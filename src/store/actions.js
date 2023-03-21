import {getCart} from "@/network/cart";

const actions = {
    updateCart({commit}){
        // console.log(commit,111)
        getCart().then(res=>{
            commit('addCart',{count:res.data.length || 0})
        })
    }
}
export default actions;
