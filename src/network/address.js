import {request} from "@/network/request";

//添加地址
export function addAddress(params){
    return request({
        url:'/api/address',
        method:'post',
        params,
    })
}

//city_id
export function getCity_id(county){
    return request({
        // url:'/api/city',
        url:'/api/city/city_id?'+'county='+county,
        // url:`/api/address/${1}`,
    })
}
//编辑地址

export function EditAddress(id,params){
    return request({
        url:`/api/address/${id}`,
        method:'put',
        params,
    })
}

//删除地址

export function DeleteAddress(id){
    return request({
        url:`/api/address/${id}`,
        method:'delete',
    })
}

//地址列表

export function getAddressList(){
    return request({
        url:'/api/address',
        method:'get',

    })
}

//地址详情

export function getAddressDetail(id){
    return request({
        url:`/api/address/${id}`,
        method:'get',
    })
}

//是否为默认地址
export function is_default(id){
    return request({
        url:`/api/address/${id}/default`,
        method:'patch',
    })
}

