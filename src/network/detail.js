import {request} from "@/network/request";

export function getDtail(id) {
    return request({
        url:'/api/goods/'+id,
    })
}
