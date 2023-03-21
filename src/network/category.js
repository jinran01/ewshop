import {request} from "@/network/request";

export function getcategory() {
    return request({
        url:'/api/goods',
    })
}

export function getcategoryGoods(order, cid = 0, page) {
    return request({
        url: '/api/goods?category_id=' + cid + '&page=' + page + '&' + order + '=1',
    })
}
