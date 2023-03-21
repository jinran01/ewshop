import {request} from "@/network/request";

//创建订单
export function createOrder(params){
    return request({
        url:'/api/orders',
        method:'post',
        params,
    })
}

//获取订单视图
export function getOrderPreview(){
    return request({
        url:'/api/orders/preview',
        method:'get',
    })
}

//订单支付 获取二维码
export function payOrder(order,params){
    return request({
        url:`/api/orders/${order}/pay`,
        params,
    })
}

//订单支付状态
export function payOrderStatus(order) {
    return request({
        url:`/api/orders/${order}/status`
    })
}

//获取订单列表
export function getOrderList(params){
    return request({
        url:'/api/orders',
        method:'get',
        params,
    })
}

//订单详情
export function getOrderDetail(order){
    return request({
        url:`/api/orders/${order}?include=user,orderDetails.goods`,
        // params:{
        //     include:'user,orderDetails.goods',
        // }
    })
}

//确认订单
export function confirmOrder(order){
    return request({
        url:`/api/orders/${order}/confirm`,
        method:'patch'
    })
}


//获取物流信息
export function getOrderExpress(order){
    return request({
        url:`/api/orders/${order}/express`,
    })
}
