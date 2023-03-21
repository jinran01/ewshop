import {request} from "@/network/request";

export function getEmailCode(params){
    return request({
        url:'/api/auth/email/code',
        method:'post',
        params
    })
}

export function ChangeEmail(params){
    return request({
        url:'/api/auth/email/update',
        method:'patch',
        params
    })
}


export function ChangeNmae(params){
    return request({
        url:'/api/user',
        method:'put',
        params
    })
}

export function getPhoneCode(params){
    return request({
        url:'/api/auth/phone/code',
        method:'post',
        params
    })
}

//绑定手机
export function BindPhone(params){
    return request({
        url:'/api/auth/phone/update',
        method:'patch',
        params
    })
}


//获取oss token
export function get_OssToken(){
    return request({
        url:'/api/auth/oss/token',
    })
}

//更换头像
export function resetAvatar(data){
    return request({
        url:'/api/auth/avatar/update',
        method:'patch',
        data

    })
}



export function ChangePassword(params){
    return request({
        url:'/api/auth/password/update',
        method:'post',
        params
    })
}

// export function test1(){
//     return request({
//         url:'/api/admin/users',
//     })
// }
//
// export function test2(params){
//     return request({
//         url:`/api/admin/users/${params.user}/lock`,
//         params
//
//     })
// }

